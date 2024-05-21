package com.wordleApp.wordlebot;

import com.wordleApp.wordlebot.model.GuessFeedback;
import org.springframework.web.bind.annotation.*;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

@RestController
@RequestMapping("/api")
public class WordleController {

    private static final String WORDLE_WORDS_PATH = "src/main/resources/FiveLetterWords.txt";
    private static final String ORIGINAL_WORDLE_WORDS_PATH = "src/main/resources/OriginalWordleWords.txt";
    private static HashSet<String> allWords;
    private static HashSet<String> targetWords;

    private static final double RATIO_FOR_USING_POSSIBLE = 1.05;

    static {
        try {
            allWords = readWords(WORDLE_WORDS_PATH);
            targetWords = readWords(ORIGINAL_WORDLE_WORDS_PATH);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    @PostMapping("/next-guess")
    public Map<String, String> getNextGuess(@RequestBody List<GuessFeedback> history) {
        HashSet<String> possibleWords = (HashSet<String>) targetWords.clone();
        for (GuessFeedback gf : history) {
            String guess = gf.getGuess();
            String feedback = gf.getFeedback();
            possibleWords = removeNAWords(possibleWords, guess, feedback);
            System.out.println(guess + ", " + feedback);
            System.out.println("possibleWords:");
            for(String word: possibleWords)
            {
                System.out.println(word);
            }
        }
        String nextGuess = generateGuess(possibleWords); 
        Map<String, String> response = new HashMap<>();
        response.put("nextGuess", nextGuess);
        return response;
    }

    private double findAlpha(HashMap<String, Integer> patternToNumPosTargets) {
        if (patternToNumPosTargets.size() == 0)
            return Double.MAX_VALUE;
        double alpha = 0;
        for (Map.Entry<String, Integer> entry : patternToNumPosTargets.entrySet()) {
            alpha += entry.getValue() * Math.log(entry.getValue());
        }
        return alpha;
    }


    private String generateGuess(HashSet<String> possibleWords) {
        String bestGuess = "NA";
        String bestGuessForPossibleWords = "NA";
        double bestAlphaValue = Double.MAX_VALUE;
        double bestAlphaValueForPossibleWords = Double.MAX_VALUE;

        for (String guess : allWords) {
            HashMap<String, Integer> patternToNumPosTargets = new HashMap<String, Integer>();
            for (String possibleTarget : possibleWords) {
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

    private static String chooseBestGuess(String targetSetGuess, String allWordsGuess, double targetAlpha, double allWordsAlpha) {
        if (targetAlpha > RATIO_FOR_USING_POSSIBLE * allWordsAlpha)
             return allWordsGuess;
        return targetSetGuess;
    }


    private static HashSet<String> readWords(String filePath) throws FileNotFoundException {
        Scanner sc = new Scanner(new File(filePath));
        HashSet<String> words = new HashSet<>();
        while (sc.hasNext()) {
            String s = sc.next();
            words.add(s);
        }
        return words;
    }

    private HashSet<String> removeNAWords(HashSet<String> possibleWords, String guess, String realPattern) {
        HashSet<String> newSet = new HashSet<>();
        for (String target : possibleWords) {
            String currentPattern = findPattern(guess, target, generateTargetMap(target));
            if (currentPattern.equals(realPattern))
                newSet.add(target);
        }
        return newSet;
    }

    private HashMap<Character, Integer> generateTargetMap(String target) {
        HashMap<Character, Integer> targetMap = new HashMap<>();
        for (char c : target.toCharArray()) {
            if (!targetMap.containsKey(c))
                targetMap.put(c, 0);
            targetMap.put(c, targetMap.get(c) + 1);
        }
        return targetMap;
    }

    private String findPattern(String guess, String target, HashMap<Character, Integer> targetMap) {
        char[] targetArray = target.toCharArray();
        char[] patternArray = new char[5];
        for (int i = 0; i < guess.length(); i++) {
            char c = guess.charAt(i);
            if (c == targetArray[i]) {
                targetMap.put(c, targetMap.get(c) - 1);
                patternArray[i] = 'G';
                targetArray[i] = ' ';
            }
        }

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
