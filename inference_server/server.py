from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle

app = Flask(__name__)
CORS(app)

with open('model.pkl', 'rb') as f:
    model = pickle.load(f)

def transform_data(data):
    model_data = {
        'bedrooms': data['postDetail']['bedroom'],
        'baths': data['postDetail']['bathroom'],
        'area': data['postDetail']['size'],
        'latitude': data['postDetail']['location']['latitude'],
        'longitude': data['postDetail']['location']['longitude'],
        'type_Flat': False,  # Assuming no specific type information in the provided data
        'type_House': True,  # Assuming it's a house based on the context
        'type_Lower_Portion': False,
        'type_Penthouse': False,
        'type_Room': False,
        'type_Upper_Portion': False,
        'city_Islamabad': data['postDetail']['location']['city'].lower() == 'islamabad',  # Assuming no specific city information in the provided data
        'city_Karachi': data['postDetail']['location']['city'].lower() == 'karachi',
        'city_Lahore': data['postDetail']['location']['city'].lower() == 'lahore',
        'city_Rawalpindi': data['postDetail']['location']['city'].lower() == 'rawalpindi',
        'province_Punjab': True,  # Assuming no specific province information in the provided data
        'province_Sindh': False
    }
    print(model_data)
    return model_data

def predict_price(house_data):
    transformed = transform_data(house_data)
    print()
    print()
    print(transformed.values())
    print(type(list(transformed.values())))
    print()
    print()   
    predicted_price = model.predict([list(transformed.values())])[0]
    return predicted_price

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    predicted_price = predict_price(data)

    return jsonify({'predicted_price': predicted_price})

if __name__ == '__main__':
    app.run(debug=True, port=8900)
