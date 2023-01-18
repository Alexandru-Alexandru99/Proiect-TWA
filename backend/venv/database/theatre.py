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
            del row["Date.Day"]
            del row["Date.Full"]
            del row["Date.Month"]
            del row["Date.Year"]
            del row["Statistics.Attendance"]
            del row["Statistics.Gross"]
            del row["Statistics.Gross Potential"]
            del row["Statistics.Performances"]
            row["Date"] = str(randrange(1, 27, 1)) + "." + str(randrange(1, 12, 1)) + "." + str(randrange(2023, 2024, 1))

            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
         
# Driver Code
 
# Decide the two file paths according to your
# computer system
csv_file =  "./events/theatre.csv"
json_file =  "./venv/database/theatre_metadata.json"
 
# Call the make_json function
csv_to_json(csv_file, json_file)