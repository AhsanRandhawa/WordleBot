package com.wordleApp.wordlebot;

import com.wordleApp.wordlebot.model.GuessFeedback;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

/**
 * Controller for handling Wordle-related API requests.
 */
@RestController
@RequestMapping("/api")
public class WordleController {

    // Paths to the word lists
    private static final String WORDLE_WORDS_PATH = "src/main/resources/FiveLetterWords.txt";
    private static final String ORIGINAL_WORDLE_WORDS_PATH = "src/main/resources/OriginalWordleWords.txt";
    private static HashSet<String> allWords;
    private static HashSet<String> targetWords;

    // Ratio used to decide whether to use possible words
    private static final double RATIO_FOR_USING_POSSIBLE = 1.05;

    // Static block to read words from files at class initialization
    static {
        try {
            allWords = readWords(WORDLE_WORDS_PATH);
            targetWords = readWords(ORIGINAL_WORDLE_WORDS_PATH);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    /**
     * Endpoint to get the next guess based on the feedback history.
     *
     * @param history List of GuessFeedback objects containing the guess and feedback.
     * @return Map containing the next guess.
     */
    @PostMapping("/next-guess")
    public Map<String, String> getNextGuess(@RequestBody List<GuessFeedback> history) {
        // Check if all guesses in history are valid words
        if (!areGuessesInDictionary(history)) {
            Map<String, String> response = new HashMap<>();
            response.put("nextGuess", "NOTW"); // Not a word response
            return response;
        }

        // Initialize possible words as a clone of target words
        HashSet<String> possibleWords = (HashSet<String>) targetWords.clone();
        for (GuessFeedback gf : history) {
            String guess = gf.getGuess();
            String feedback = gf.getFeedback();
            // Update possible words based on feedback
            possibleWords = removeNAWords(possibleWords, guess, feedback);
        }
        // Generate the next guess
        String nextGuess = generateGuess(possibleWords);
        Map<String, String> response = new HashMap<>();
        response.put("nextGuess", nextGuess);
        return response;
    }

    /**
     * Checks if all guesses in the history are in the dictionary.
     *
     * @param history List of GuessFeedback objects.
     * @return true if all guesses are in the dictionary, false otherwise.
     */
    private boolean areGuessesInDictionary(List<GuessFeedback> history) {
        for (GuessFeedback gf : history) {
            if (!allWords.contains(gf.getGuess())) return false;
        }
        return true;
    }

    /**
     * Calculates the alpha value for the given pattern-to-number-of-possible-targets map.
     *
     * @param patternToNumPosTargets Map of patterns to the number of possible targets.
     * @return The calculated alpha value.
     */
    private double findAlpha(HashMap<String, Integer> patternToNumPosTargets) {
        if (patternToNumPosTargets.size() == 0)
            return Double.MAX_VALUE;
        double alpha = 0;
        for (Map.Entry<String, Integer> entry : patternToNumPosTargets.entrySet()) {
            alpha += entry.getValue() * Math.log(entry.getValue());
        }
        return alpha;
    }

    /**
     * Generates the best guess based on the possible words.
     *
     * @param possibleWords Set of possible words.
     * @return The best guess.
     */
    private String generateGuess(HashSet<String> possibleWords) {
        String bestGuess = "NA"; // Default guess if no better guess is found
        String bestGuessForPossibleWords = "NA"; // Best guess from possible words
        double bestAlphaValue = Double.MAX_VALUE;
        double bestAlphaValueForPossibleWords = Double.MAX_VALUE;

        for (String guess : allWords) {
            HashMap<String, Integer> patternToNumPosTargets = new HashMap<>();
            for (String possibleTarget : possibleWords) {
                // Find pattern for each guess-target pair
                String pattern = findPattern(guess, possibleTarget, generateTargetMap(possibleTarget));
                patternToNumPosTargets.put(pattern, patternToNumPosTargets.getOrDefault(pattern, 0) + 1);
            }
            double alpha = findAlpha(patternToNumPosTargets);
            if (alpha < bestAlphaValue) {
                bestGuess = guess;
                bestAlphaValue = alpha;
            }
            if (possibleWords.contains(guess) && alpha < bestAlphaValueForPossibleWords) {
                bestGuessForPossibleWords = guess;
                bestAlphaValueForPossibleWords = alpha;
            }
        }
        return chooseBestGuess(bestGuessForPossibleWords, bestGuess, bestAlphaValueForPossibleWords, bestAlphaValue);
    }

    /**
     * Chooses the best guess between the target set guess and all words guess based on alpha values.
     *
     * @param targetSetGuess The guess from the target set.
     * @param allWordsGuess The guess from all words.
     * @param targetAlpha The alpha value for the target set guess.
     * @param allWordsAlpha The alpha value for the all words guess.
     * @return The best guess.
     */
    private static String chooseBestGuess(String targetSetGuess, String allWordsGuess, double targetAlpha, double allWordsAlpha) {
        if (targetAlpha > RATIO_FOR_USING_POSSIBLE * allWordsAlpha)
            return allWordsGuess;
        return targetSetGuess;
    }

    /**
     * Reads words from the specified file path.
     *
     * @param filePath The path to the file.
     * @return Set of words read from the file.
     * @throws FileNotFoundException If the file is not found.
     */
    private static HashSet<String> readWords(String filePath) throws FileNotFoundException {
        Scanner sc = new Scanner(new File(filePath));
        HashSet<String> words = new HashSet<>();
        while (sc.hasNext()) {
            String s = sc.next();
            words.add(s);
        }
        return words;
    }

    /**
     * Removes words that do not match the given guess and pattern.
     *
     * @param possibleWords Set of possible words.
     * @param guess The current guess.
     * @param realPattern The feedback pattern for the guess.
     * @return Set of possible words that match the pattern.
     */
    private HashSet<String> removeNAWords(HashSet<String> possibleWords, String guess, String realPattern) {
        HashSet<String> newSet = new HashSet<>();
        for (String target : possibleWords) {
            String currentPattern = findPattern(guess, target, generateTargetMap(target));
            if (currentPattern.equals(realPattern))
                newSet.add(target);
        }
        return newSet;
    }

    /**
     * Generates a map of characters to their counts in the target word.
     *
     * @param target The target word.
     * @return Map of characters to their counts in the target word.
     */
    private HashMap<Character, Integer> generateTargetMap(String target) {
        HashMap<Character, Integer> targetMap = new HashMap<>();
        for (char c : target.toCharArray()) {
            if (!targetMap.containsKey(c))
                targetMap.put(c, 0);
            targetMap.put(c, targetMap.get(c) + 1);
        }
        return targetMap;
    }

    /**
     * Finds the feedback pattern for the given guess and target word.
     *
     * @param guess The current guess.
     * @param target The target word.
     * @param targetMap Map of characters to their counts in the target word.
     * @return The feedback pattern for the guess.
     */
    private String findPattern(String guess, String target, HashMap<Character, Integer> targetMap) {
        char[] targetArray = target.toCharArray();
        char[] patternArray = new char[5];
        // First pass: find correct letters (green)
        for (int i = 0; i < guess.length(); i++) {
            char c = guess.charAt(i);
            if (c == targetArray[i]) {
                targetMap.put(c, targetMap.get(c) - 1);
                patternArray[i] = 'G';
                targetArray[i] = ' ';
            }
        }

        // Second pass: find wrong position letters (yellow) and incorrect letters (grey)
        for (int i = 0; i < guess.length(); i++) {
            if (patternArray[i] == 'G')
                continue;
            char c = guess.charAt(i);
            int numLetters = targetMap.getOrDefault(c, 0);
            if (numLetters > 0) {
                patternArray[i] = 'Y';
                targetMap.put(c, numLetters - 1);
            } else
                patternArray[i] = 'B';
        }
        return new String(patternArray);
    }
}
