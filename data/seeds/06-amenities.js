class Amenities {
  constructor(name) {
    this.name = name;
  }
}

const amenities = [
  "wifi",
  "heating",
  "kitchen",
  "essentials",
  "washer",
  "hair dryer",
  "laptop friendly workspace",
  "hangers",
  "iron",
  "hot water",
  "shampoo",
  "tv",
  "family",
  "kid friendly",
  "internet",
  "host greets you",
  "smoke detector",
  "buzzer",
  "wireless intercom",
  "free street parking",
  "refrigerator",
  "dishes and silverware",
  "bed linens",
  "cooking basics",
  "stove",
  "lock on bedroom door",
  "oven",
  "elevator",
  "coffee maker",
  "smoking allowed",
  "first aid kit",
  "cable tv",
  "dishwasher",
  "long term stays allowed",
  "luggage dropoff allowed",
  "dryer",
  "fire extinguisher",
  "pets allowed",
  "extra pillows and blankets",
  "patio or balcony",
  "microwave",
  "private entrance",
  "paid parking off premises",
  "safety card",
  "free parking on premises",
  "private living room",
  "bathtub"
];
const amenitiesArr = [];
amenities.map(amenity => {
  amenitiesArr.push(new Amenities(amenity));
});

exports.seed = function(knex) {
  return knex("amenities").insert(amenitiesArr);
};
