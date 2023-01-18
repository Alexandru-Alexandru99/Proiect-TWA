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
            row["Date"] = row["Date"].replace("2020", "2023")
            row["Date"] = row["Date"].replace("2021", "2024")
            row["Ticket price"] = str(100)
            row["Number of tickets"] = str(randrange(15000, 30000, 10))
            del row["FT"]
            del row["Round"]
            jsonArray.append(row)
  
    #convert python jsonArray to JSON String and write to file
    with open(jsonFilePath, 'w', encoding='utf-8') as jsonf: 
        jsonString = json.dumps(jsonArray, indent=4)
        jsonf.write(jsonString)
         
# Driver Code
 
# Decide the two file paths according to your
# computer system
csv_file =  "./events/matches.csv"
json_file =  "./venv/database/matches_metadata.json"
 
# Call the make_json function
csv_to_json(csv_file, json_file)