module.exports = (sequelize, DataTypes) => {
	return sequelize.define('script', {
		id: { 
			type: DataTypes.STRING,
			primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
		webViewLink: {
            type: DataTypes.STRING,
            allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
		}
	}, {
		timestamps: false,
	});
};