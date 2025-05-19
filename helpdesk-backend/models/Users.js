const { v4: uuidv4 } = require("uuid");
const { sequelize } = require("../database");
const User = sequelize.define("User", {
    userId: {
        type: String,
        primaryKey: true,
        defaultValue: () => uuidv4(),
    },
    username: {
        type: String,
        allowNull: false,
        unique: true,
        required: true
    },
    email: {
        type: String,
        allowNull: false,
        unique: true,
        required: true,
          validator: function(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: props => `${props.value} is not a valid email!`
    },
    password: {
        type: String,
        allowNull: false,
        required: true
    },
    firstName: {
        type: String,
        allowNull: false,
        required: true
    },
    lastName: {
        type: String,
        allowNull: false,
        required: true
    },
    accessLevel: {
        type: String,
        allowNull: false,
        defaultValue: 'user',
        required: true
    },
    jobRole: {
        type: String,
        allowNull: true, 
    },
    description: {
      type: String,
      allowNull: true,
    },
    profileImage: {
      type: String, 
      allowNull: true,
    }

});
module.exports = User;