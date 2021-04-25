module.exports = (sequelize, DataTypes) => {
	return sequelize.define('script_tag', {
		script_id: DataTypes.STRING,
		tag_id: DataTypes.STRING,
	}, {
		timestamps: false,
		underscored: true,
	});
};