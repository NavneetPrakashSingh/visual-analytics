from flask import Flask, jsonify, render_template
import csv
import pandas as pd
import numpy as np

app = Flask(__name__)

# titanic_df = pd.read_csv("static/data/train.csv")
df = pd.read_csv("static/data/Final_Dataset.csv")
# survived = titanic_df[(titanic_df['Survived']==1) & (titanic_df["Age"].notnull())]

path_for_dataframe =""
@app.route('/load_data/<path>')
def plotData(path):
    path_for_dataframe = "static/data/"+path
    # titanic_df = pd.read_csv(path_for_dataframe)
    # survived = titanic_df[(titanic_df['Survived']==1) & (titanic_df["Age"].notnull())]
    return path_for_dataframe

@app.route('/get_piechart_barchart')
def get_piechart_barchart():
     return render_template('home.html')

@app.route('/')
def index():
    return render_template('base.html')   

@app.route('/get_scatter_plot_data')
def get_scatter_plot_data():
    scatterPlotData = []
    # print(df)
    for index,row in df.iterrows():
        print(row)
        eachData = {}
        eachData['carbondioxide'] = row['cumulative_co2_emissions_tonnes']
        eachData['life'] = row["expectancy "]
        eachData['status'] = row['Status']
        scatterPlotData.append(eachData)
    
    return jsonify(scatterPlotData)

# def calculate_percentage(val, total):
#     """Calculates the percentage of a value over a total"""
#     percent = np.divide(val, total)
    
#     return percent

@app.route('/get_piechart_data')
def get_piechart_data():
    # class_labels = ['Class I', 'Class II', 'Class III']
    # pclass_percent = calculate_percentage(survived.groupby('Pclass').size().values, survived['PassengerId'].count())*100
    # pieChartData = []
    # for index, item in enumerate(pclass_percent):
    #     eachData = {}
    #     eachData['category'] = class_labels[index]
    #     eachData['measure'] =  round(item,1)
    #     pieChartData.append(eachData)

    # return jsonify(pieChartData)
    return jsonify("")

@app.route('/get_barchart_data')
def get_barchart_data():
    return jsonify("")

#     age_labels = ['0-9', '10-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79']
#     survived["age_group"] = pd.cut(survived.Age, range(0, 81, 10), right=False, labels=age_labels)
#     survived[['age_group', 'Pclass']]

#     survivorFirstClass = survived[survived['Pclass']==1]
#     survivorSecondClass = survived[survived['Pclass']==2]
#     survivorThirdClass = survived[survived['Pclass']==3]

#     survivorAllclassPercent = calculate_percentage(survived.groupby('age_group').size().values,survived['PassengerId'].count())*100
#     survivorFirstclassPercent = calculate_percentage(survivorFirstClass.groupby('age_group').size().values,survivorFirstClass['PassengerId'].count())*100
#     survivorSecondclassPercent = calculate_percentage(survivorSecondClass.groupby('age_group').size().values,survivorSecondClass['PassengerId'].count())*100
#     survivorThirdclassPercent = calculate_percentage(survivorThirdClass.groupby('age_group').size().values,survivorThirdClass['PassengerId'].count())*100

#     barChartData = []
#     for index, item in enumerate(survivorAllclassPercent):
#         eachBarChart = {}
#         eachBarChart['group'] = "All"
#         eachBarChart['category'] = age_labels[index]
#         eachBarChart['measure'] = round(item,1)
#         barChartData.append(eachBarChart)


#     for index, item in enumerate(survivorFirstclassPercent):
#         eachBarChart = {}
#         eachBarChart['group'] = "Class I"
#         eachBarChart['category'] = age_labels[index]
#         eachBarChart['measure'] = round(item,1)
#         barChartData.append(eachBarChart)

#     for index, item in enumerate(survivorSecondclassPercent):
#         eachBarChart = {}
#         eachBarChart['group'] = "Class II"
#         eachBarChart['category'] = age_labels[index]
#         eachBarChart['measure'] = round(item,1)
#         barChartData.append(eachBarChart)

#     for index, item in enumerate(survivorThirdclassPercent):
#         eachBarChart = {}
#         eachBarChart['group'] = "Class III"
#         eachBarChart['category'] = age_labels[index]
#         eachBarChart['measure'] = round(item,1)
#         barChartData.append(eachBarChart)
    
#     return jsonify(barChartData)


if __name__ == '__main__':
      app.run(debug=True)