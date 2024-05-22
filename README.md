# Wordle Bot

## Overview

The Wordle Bot is a sophisticated application designed to assist users in playing the popular Wordle game. It leverages concepts from information theory to generate optimal word guesses based on user feedback, enhancing the overall gameplay experience.

## Features

- **Optimal Guess Generation**: Utilizes advanced algorithms and information theory to suggest the best possible next guess.
- **Dynamic Front-End**: Built with React, providing real-time user interactions and visual feedback.
- **Cloud Deployment**: Deployed on AWS Elastic Beanstalk for high availability and scalability.
- **Secure API Communication**: Ensures secure communication between the front-end and back-end services.

## Technologies Used

- **Java & Spring Boot**: For building the back-end services.
- **React**: For creating the dynamic front-end.
- **AWS Elastic Beanstalk**: For cloud deployment and scalability.
- **Nginx**: For efficient request handling and performance optimization.

## Already Deployed App

- The app is deployed on AWS at the following link: http://wordlebot-env-1.eba-kwi9hfra.us-east-2.elasticbeanstalk.com

## Setup and Deployment

### Prerequisites

- **Java 17**: Ensure Java 17 is installed and configured.
- **Maven**: For building and packaging the application.

### Local Setup

1. **Clone the Repository**:
   git clone https://github.com/AhsanRandhawa/WordleBot.git
   cd WordleBot
2. **Build the Application**:
   mvn clean package
3. **Run the Application**:
   java -jar target/wordlebot-0.0.1-SNAPSHOT.jar


