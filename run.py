from flask import Flask, jsonify, render_template, json
import csv
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor
from sklearn.tree import DecisionTreeClassifier 
from sklearn.model_selection import train_test_split 
from sklearn import metrics
from sklearn.metrics import confusion_matrix

app = Flask(__name__)

# titanic_df = pd.read_csv("static/data/train.csv")
df = pd.read_csv("static/data/Final_Dataset.csv")

df = df.fillna(0)
null_columns=df.columns[df.isnull().any()]
df[null_columns].isnull().sum()
y= df['expectancy '].values
X = df.drop(['expectancy ','Status','Country'], axis=1).values

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.3)
# survived = titanic_df[(titanic_df['Survived']==1) & (titanic_df["Age"].notnull())]
names = df.drop(['Country','Status'],axis=1).columns.values
label_names = []
feature_names = []
for i in names:
    if i == "expectancy ":
        label_names.append(i)
    else:
        feature_names.append(i)

path_for_dataframe =""
@app.route('/load_data/<path>')
def plotData(path):
    path_for_dataframe = "static/data/"+path
    # titanic_df = pd.read_csv(path_for_dataframe)
    # survived = titanic_df[(titanic_df['Survived']==1) & (titanic_df["Age"].notnull())]
    return path_for_dataframe

def rules(clf, features, labels, node_index=0):
    """Structure of rules in a fit decision tree classifier

    Parameters
    ----------
    clf : DecisionTreeClassifier
        A tree that has already been fit.

    features, labels : lists of str
        The names of the features and labels, respectively.

    """
    node = {}
    if clf.tree_.children_left[node_index] == -1:  # indicates leaf
        count_labels = zip(clf.tree_.value[node_index, 0], labels)
        node['name'] = ', '.join(('{} of {}'.format(int(count), label)
                                  for count, label in count_labels))
    else:
        feature = features[clf.tree_.feature[node_index]]
        threshold = clf.tree_.threshold[node_index]
        node['name'] = '{} > {}'.format(feature, threshold)
        left_index = clf.tree_.children_left[node_index]
        right_index = clf.tree_.children_right[node_index]
        node['children'] = [rules(clf, features, labels, right_index),
                            rules(clf, features, labels, left_index)]
    return node


@app.route('/split')
def split():
    y= df['Status']
    features = ['expectancy ','cumulative_co2_emissions_tonnes']
    X = df[features]
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3)
    clf = DecisionTreeClassifier()
    clf = clf.fit(X_train,y_train)
    y_pred = clf.predict(X_test)
    accuracy = metrics.accuracy_score(y_test, y_pred)
    matrix = confusion_matrix(y_test,y_pred)
    print("True positive",matrix[0][0])
    return jsonify({"tp":int(matrix[0][0]),"fp":int(matrix[0][1]),"fn":int(matrix[1][0]),"tn":int(matrix[1][1]), "accuracy":accuracy})


@app.route('/get_dt_data')
def get_dt_data():
    
    clf_dt = DecisionTreeRegressor()
    clf_dt.fit(X_train, y_train)
    r = rules(clf_dt, feature_names, label_names)
    return jsonify(r)

@app.route('/get_piechart_barchart')
def get_piechart_barchart():
     return render_template('home.html')

@app.route('/')
def index():
    return render_template('base.html')   


@app.route('/get_tree_data')
def get_tree_data():

    return ""

@app.route('/get_scatter_plot_data')
def get_scatter_plot_data():
    scatterPlotData = []
    # print(df)
    for index,row in df.iterrows():
        # print(row)
        eachData = {}
        eachData['carbondioxide'] = row['cumulative_co2_emissions_tonnes']
        eachData['life'] = row["expectancy "]
        eachData['status'] = row['Status']
        scatterPlotData.append(eachData)
    return jsonify(scatterPlotData)

@app.route('/get_histogram_data')
def get_histogram_data():
    histogramData = []
    year = df['Year'] == 2007
    carbondioxide = df['cumulative_co2_emissions_tonnes'] < 14000000000
    for index, row in df[year & carbondioxide].iterrows():
        eachData = {}
        eachData['country'] = row['Country']
        eachData['carbondioxide'] = row['cumulative_co2_emissions_tonnes']
        eachData['life'] = row["expectancy "]
        eachData['status'] = row['Status']
        histogramData.append(eachData)       
    
    return jsonify(histogramData)

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
    output = ['Developed', 'Developing']
    count_total = df.groupby('Status', as_index=False)['expectancy '].mean()
    cnt = df.groupby('Status', as_index=False)['cumulative_co2_emissions_tonnes'].mean()
    df_out = pd.merge(count_total,cnt,on='Status')
    barChartData = []
    for index, item in df_out.iterrows():
        eachBarChart = {}
        eachBarChart['Status'] = output[index]
        eachBarChart['measure'] = item['expectancy ']
        eachBarChart['category'] = item['cumulative_co2_emissions_tonnes']
        barChartData.append(eachBarChart)
    return jsonify(barChartData)

@app.route('/spatialbar')
def spatialbar():
    return render_template('spatialbar.html',data=df.to_json(orient="index"))

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
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)