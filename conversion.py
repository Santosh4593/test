import csv
def csv_to_json(csv_content):
    try:
        data = {}
        lines = csv_content.split("\n")
        reader = csv.DictReader(lines)
        header = reader.fieldnames  # Get the header

        for row in reader:
            direction = row["Direction"]
            for key in header[1:]:  # Exclude the first column (Direction)
                if key not in data:
                    data[key] = {'Up': 0, 'Down': 0}
                if row[key].isdigit():
                    data[key][direction] += int(row[key])  # Fix: Increment the count
        return data
    except Exception as e:
        raise e
    
# csv_content = open("data.csv").read()
# print(csv_to_json(csv_content))