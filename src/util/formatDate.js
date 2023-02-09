const formatDate = (date) => {
  let d = date,
    month = String(d.getMonth() + 1).padStart(2, 0),
    day = String(d.getDate()).padStart(2, 0),
    year = d.getFullYear();

  return [year, month, day].join('-');
};

module.exports = formatDate;
