var db = require("./db_config");

var sql = "SELECT * FROM market";

db.query(sql, function (err, result) {
  if (err) throw err;
  // gunakan perulangan untuk menampilkan data
  console.log(`ID \t NAME \t\t stock \t\t harga`);
  console.log(`----------------------------------------------------------`);
  result.forEach((mbr) => {
    console.log(`${mbr.id} \t ${mbr.nama_barang} \t ${mbr.stock_barang} \t\t ${mbr.harga_barang}`);
  });
});