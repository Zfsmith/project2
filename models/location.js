module.exports = function(sequelize, DataTypes){
  var Location = sequelize.define("Location", {
    name: DataTypes.STRING,
    ratingAvg:DataTypes.INTEGER,
    address: DataTypes.STRING,
    website: DataTypes.STRING,
    mapsUrl: DataTypes.STRING
  }, {
    classMethods: {
        associate: function(models) {
          Location.hasMany(models.userRating, models.monthlyChallenge);
        }
      }
  }
);
  return Location;
};
