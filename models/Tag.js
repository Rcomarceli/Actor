module.exports = (sequelize, DataTypes) => {
	return sequelize.define('tag', {
		name: {
			type: DataTypes.STRING,
			unique: true,
		},
	}, {
		timestamps: false,
	});
};