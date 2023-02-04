module.exports = (error, req, res, next) => {
  if (error.name.includes('Sequelize')) {
    return res.status(500).json({ errorMessage: 'Internal Server Error' });
  } else {
    res.status(error.status || 400).json({ errorMessage: error.message });
  }
};
