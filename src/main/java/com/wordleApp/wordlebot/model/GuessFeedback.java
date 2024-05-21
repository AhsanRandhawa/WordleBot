package com.wordleApp.wordlebot.model;

public class GuessFeedback {
    private String guess;
    private String feedback;

    public GuessFeedback() {}

    public GuessFeedback(String guess, String feedback) {
        this.guess = guess;
        this.feedback = feedback;
    }

    public String getGuess() {
        return guess;
    }

    public void setGuess(String guess) {
        this.guess = guess;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }
}
