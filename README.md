# Smart Room Occupancy Prediction

## Machine Learning-Based Smart Room Occupancy Prediction for Energy-Efficient Building Management

### Project Overview

This project uses machine learning to predict whether a room is occupied or unoccupied using environmental sensor measurements.

The system analyzes parameters such as temperature, humidity, light intensity, CO2 concentration, and humidity ratio to classify room occupancy.

Based on the predicted occupancy status, the system provides an energy-saving recommendation.

### Objective

The main objective of this project is to develop a machine learning-based occupancy prediction system that can support energy-efficient building management.

### Dataset

The project uses the UCI Occupancy Detection dataset.

Dataset source:

https://archive.ics.uci.edu/dataset/357/occupancy-detection

### Input Features

- Temperature
- Humidity
- Light
- CO2
- HumidityRatio

### Target Variable

Occupancy

- 0 - Unoccupied
- 1 - Occupied

### Machine Learning Algorithms

The following classification algorithms are implemented:

- Logistic Regression
- K-Nearest Neighbors (KNN)
- Decision Tree
- Support Vector Machine (SVM)

### Data Preprocessing

The preprocessing pipeline includes:

- Data quality checking
- Missing-value verification
- Duplicate checking
- Feature selection
- Target preparation
- Feature scaling
- Train-test splitting

### Model Evaluation

The models are evaluated using:

- Accuracy
- Precision
- Recall
- F1-score
- Confusion Matrix
- ROC-AUC
- Cross-validation

### Energy-Saving Recommendation

The predicted occupancy status is converted into an energy-saving recommendation.

- Occupied → Normal Operation
- Unoccupied → Energy-Saving Mode

The current system provides a recommendation. It does not directly control physical lights or HVAC equipment.

### Technologies Used

- Python
- Jupyter Notebook
- Pandas
- NumPy
- Matplotlib
- Seaborn
- Scikit-learn

### Project Workflow

```text
UCI Dataset
    ↓
Data Preprocessing
    ↓
Exploratory Data Analysis
    ↓
Feature Selection
    ↓
Feature Scaling
    ↓
Train-Test Split
    ↓
Model Training
    ↓
Hyperparameter Tuning
    ↓
Cross-Validation
    ↓
Model Evaluation
    ↓
Occupancy Prediction
    ↓
Energy-Saving Recommendation
