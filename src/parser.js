module.exports.parsePdf = (data) => {
  const dataText = data.text;

  const curp = dataText.search(/CURP:/);
  const licenseFirst = dataText.search(/Número de Licencia:/);
  const marker = dataText.search(/DIGITAL DE CONDUCTOR/) + 18;
  const fecha = dataText.search(/Fecha y hora/);
  const antig = dataText.search(/Antigüedad:/);

  const name = dataText.substring(marker + 1, fecha);

  const licenseIndex = licenseFirst + 19;
  const licenseLast = curp;
  const license = dataText.substring(licenseIndex, licenseLast);

  const dateIndex = antig + 11;
  const lastCharacter = dateIndex + 11;
  const date = dataText.substring(dateIndex, lastCharacter);
  const dd = date.substring(1, 3);
  const mm = date.substring(4, 6);
  const yyyy = date.substring(7, 11);
  const issueDate = mm + "/" + dd + "/" + yyyy;
  const d = new Date().toLocaleDateString();
  const date1 = new Date(issueDate);
  const date2 = new Date(d);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffYears = Math.ceil(diffDays / 365);

  return { name, license, issueDate, diffYears };
};
