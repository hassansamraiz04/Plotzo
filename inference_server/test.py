import requests

# Send a POST request with JSON data
response = requests.post('http://localhost:8900/predict', json={
    'id': 1,
    'title': "Beautiful Apartment in the City Center",
    'address': "123 Main St, City, State",
    'price': 1500,
    'postDetail': {
        'desc': "Future alike hill pull picture swim magic chain seed engineer nest outer raise bound easy poetry gain loud weigh me recognize farmer bare danger. actually put square leg vessels earth engine matter key cup indeed body film century shut place environment were stage vertical roof bottom lady function breeze darkness beside tin view local breathe carbon swam declared magnet escape has from pile apart route coffee storm someone hold space use ahead sheep jungle closely natural attached part top grain your grade trade corn salmon trouble new bend most teacher range anybody every seat fifteen eventually",
        'utilities': "owner",
        'pet': "allowed",
        'income': "2x rent",
        'size': 1000,
        'bedroom': 2,
        'bathroom': 1,
        'school': 500,
        'bus': 300,
        'restaurant': 200,
        'location': {
            'city': "London",
            'address': "1234 Broadway St",
            'latitude': 51.5074,
            'longitude': -0.1278
        }
    },
    'isSaved': False
})

# Print the response content
print(response.json())
