import csv
import json
from random import randrange
 
# Function to convert a CSV to JSON
# Takes the file paths as arguments
def csv_to_json(csvFilePath, jsonFilePath):
    jsonArray = []
      
    #read csv file
    with open(csvFilePath, encoding='utf-8') as csvf: 
        #load csv file data using csv library's dictionary reader
        csvReader = csv.DictReader(csvf) 

        #convert each csv row into python dict
        for row in csvReader: 
            #add this python dict to json array
            row["Ticket price"] = str(100)
            row["Number of tickets"] = str(randrange(15000, 30000, 10))
            row["date"] = str(randrange(1, 27, 1)) + "." + str(randrange(1, 12, 1)) + "." + str(randrange(2023, 2024, 1))
            del row["Worldwide Gross"]
            del row["Profitability"]
            del row["Audience score %"]
            del row["Rotten Tomatoes %"]
            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
         
# Driver Code
 
# Decide the two file paths according to your
# computer system
csv_file =  "./events/movies.csv"
json_file =  "./venv/database/movies_metadata.json"
 
# Call the make_json function
csv_to_json(csv_file, json_file)