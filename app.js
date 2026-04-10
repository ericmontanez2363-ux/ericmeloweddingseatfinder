/**
 * Sage & Ivory Wedding Seat Finder — app.js
 * Each guest has: name, table, companions[]
 * Data lives in localStorage — works as a GitHub Pages static site.
 */

const STORAGE_KEY = "sage_seatfinder_v1";

let guests = [];

/* ─── Init ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  loadGuests();
  renderAdminList();
  updateGuestCount();

  // Auto-focus search
  setTimeout(() => document.getElementById("search-input")?.focus(), 400);

  // Pre-fill from QR: ?name=Maria+Santos
  const params = new URLSearchParams(window.location.search);
  const prefill = params.get("name") || params.get("n");
  if (prefill) {
    document.getElementById("search-input").value = decodeURIComponent(prefill);
    handleSearch();
  }

  // Close admin on backdrop click
  document.getElementById("admin-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAdmin();
  });

  // Close tables on backdrop click
  document.getElementById("tables-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeTables();
  });
});

/* ─── Storage ───────────────────────────────────────── */
function loadGuests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    guests = raw ? JSON.parse(raw) : getDefaultGuests();
    if (!raw) saveGuests();
  } catch {
    guests = getDefaultGuests();
  }
}

function saveGuests() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

function getDefaultGuests() {
  return [
  { "name": "Jocelyn Manalo", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Maria Bianca Ofelia Tabaquin", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Gay Valerie Valmores", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Paul Erik Manalo", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Marilou Constancia Libres", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Mary Grace Ladia", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Zenaida Del Mundo", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Carlo Villacorta", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Alexander Regala", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Jocelyn Paraiso", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Elizabeth Disono", "table": " • VIP 1", "companions": ["Jocelyn Manalo", "Maria Bianca Ofelia Tabaquin", "Gay Valerie Valmores", "Paul Erik Manalo", "Marilou Constancia Libres", "Mary Grace Ladia", "Zenaida Del Mundo", "Carlo Villacorta", "Alexander Regala", "Jocelyn Paraiso", "Elizabeth Disono"] },
  { "name": "Mario Gani Sr.", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Editha Gani", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Ricardo Montañez Sr.", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Eledina Montañez", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Rosalie Lacanlale", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Maria Julie Gani", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Vivian Cordova", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Marites Ampusta", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Mary Ann Teña", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Robert Joseph De Claro", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
  { "name": "Jonathan Gary Jimenez", "table": " • VIP 2", "companions": ["Mario Gani Sr.", "Editha Gani", "Ricardo Montañez Sr.", "Eledina Montañez", "Rosalie Lacanlale", "Maria Julie Gani", "Vivian Cordova", "Marites Ampusta", "Mary Ann Teña", "Robert Joseph De Claro", "Jonathan Gary Jimenez"] },
{ name: "Liezl Abad", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Judylyn Alvarez", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Aileen Carriedo", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Jr. Gani, Mario", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Joey Cordova", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Edmund Nietes", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Eugenia Nietes", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Setira Mae Ronquillo", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Emma Campolio", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Mark Gane", table: "Table 1", companions: ["Liezl Abad", "Judylyn Alvarez", "Aileen Carriedo", "Mario Gani Jr.", "Joey Cordova", "Edmund Nietes", "Eugenia Nietes", "Setira Mae Ronquillo", "Emma Campolio", "Mark Gane"] },
{ name: "Renabel Lacanlale", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Gabriel Carriedo", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Zairine Paz Carriedo", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Geeca Rae Carriedo", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Sheryl Carriedo", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Jayson Montañez", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Christine Montañez", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Mary Joy Montañez", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Ricardo Montañez Jr.", table: "Table 2", companions: ["Renabel Lacanlale", "Gabriel Carriedo", "Zairine Paz Carriedo", "Geeca Rae Carriedo", "Sheryl Carriedo", "Jayson Montañez", "Christine Montañez", "Mary Joy Montañez", "Ricardo Montañez Jr."] },
{ name: "Elizer Montañez", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Myrna Montañez", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Cherlie Maglente", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Analyn Juson", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Eduard Ballano", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Nenita Quimpo", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Norma Ballano", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Irish Disono", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Joebert Disono", table: "Table 3", companions: ["Elizer Montañez", "Myrna Montañez", "Cherlie Maglente", "Analyn Juson", "Eduard Ballano", "Nenita Quimpo", "Norma Ballano", "Irish Disono", "Joebert Disono"] },
{ name: "Janeth Laurel", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Dorothy Adlawan", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Kia Mae Inabangan", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Alloha Mae Rubi", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Melani Antipolo", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Liezel Balmores", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Myla Mangayaay", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Maria Teresa Noynay", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Jake Escototo", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Andrew Silvosa", table: "Table 4", companions: ["Janeth Laurel", "Dorothy Adlawan", "Kia Mae Inabangan", "Alloha Mae Rubi", "Melani Antipolo", "Liezel Balmores", "Myla Mangayaay", "Maria Teresa Noynay", "Jake Escototo", "Andrew Silvosa"] },
{ name: "Arman Louise Mariano", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Angelica Trinidad", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Joerrel Maguigad", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Alyanna Marcelino", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Dan John Landong", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Miguel Malig", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Jefferson Samonte", table: "Table 5", companions: ["Arman Louise Mariano", "Angelica Trinidad", "Joerrel Maguigad", "Alyanna Marcelino", "Dan John Landong", "Miguel Malig", "Jefferson Samonte"] },
{ name: "Maria Celina Delapo", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Amelia Cipriano", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Albert James Ragua", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Fredezwinda Gaba", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Renz Diego Geronimo", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Marilou Aberin", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Agape Garcia", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Sophia Jane Valdez", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Jose Conrado Magcalas", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Rizalina Magsino-Valencerina", table: "Table 6", companions: ["Maria Celina Delapo", "Amelia Cipriano", "Albert James Ragua", "Fredezwinda Gaba", "Renz Diego Geronimo", "Marilou Aberin", "Agape Garcia", "Sophia Jane Valdez", "Jose Conrado Magcalas", "Rizalina Magsino-Valencerina"] },
{ name: "Rhea Rose Lazaro", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Sherlyn Morota", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Jessica Adap", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Victorina Pardo-Pajarillo", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Virginia Tablan", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Mary Susan Tomacruz", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Edison Villarin", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Ma. Kristina Mamaril", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Celine Shin", table: "Table 7", companions: ["Rhea Rose Lazaro", "Sherlyn Morota", "Jessica Adap", "Victorina Pardo-Pajarillo", "Virginia Tablan", "Mary Susan Tomacruz", "Edison Villarin", "Ma. Kristina Mamaril", "Celine Shin"] },
{ name: "Jeremy Camille Cruz", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
{ name: "Crisfamer Delos Santos", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
{ name: "Minerva Garcia", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
{ name: "Ericka Quiño", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
{ name: "Louie Anne Alalayin", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
{ name: "Mary Ann Cristobal", table: "Table 8", companions: ["Jeremy Camille Cruz", "Crisfamer Delos Santos", "Minerva Garcia", "Ericka Quiño", "Louie Anne Alalayin", "Mary Ann Cristobal"] },
  ];
}

/* ─── Search ────────────────────────────────────────── */
function handleSearch() {
  const query = document.getElementById("search-input").value.trim();
  const area  = document.getElementById("results-area");
  area.innerHTML = "";

  if (!query) return;

  const matches = guests.filter(g =>
    g.name.toLowerCase().includes(query.toLowerCase())
  );

  if (matches.length === 0) {
    area.innerHTML = `
      <div class="result-empty">
        <div class="result-empty-icon">❧</div>
        <p class="result-empty-text">No guest found for "<em>${escHtml(query)}</em>"</p>
        <p class="result-empty-sub">Please check your name or ask an usher</p>
      </div>
    `;
    return;
  }

  matches.forEach((g, i) => {
    const companions = (g.companions || []).filter(Boolean);

    const companionPills = companions.length
      ? companions.map(c => `<span class="companion-pill">${escHtml(c)}</span>`).join("")
      : `<span class="no-companions">You have the table to yourself</span>`;

    const card = document.createElement("div");
    card.className = "result-card";
    card.style.animationDelay = `${i * 70}ms`;
    card.innerHTML = `
      <div class="card-top">
        <div class="card-name-block">
          <p class="card-label">Guest</p>
          <p class="card-name">${escHtml(g.name)}</p>
        </div>
        <div class="card-table-badge">${escHtml(g.table)}</div>
      </div>
      <div class="card-companions">
        <p class="companions-label">Seated with</p>
        <div class="companions-list">${companionPills}</div>
      </div>
    `;
    area.appendChild(card);
  });
}

function handleKey(e) {
  if (e.key === "Escape") {
    document.getElementById("search-input").value = "";
    document.getElementById("results-area").innerHTML = "";
  }
}

/* ─── View All Tables ───────────────────────────────── */
function openTables() {
  renderTables();
  document.getElementById("tables-overlay").classList.remove("hidden");
}

function closeTables() {
  document.getElementById("tables-overlay").classList.add("hidden");
}

function renderTables() {
  const grid = document.getElementById("tables-grid");
  if (!grid) return;

  if (guests.length === 0) {
    grid.innerHTML = `
      <div class="tables-empty">
        <div class="tables-empty-icon">❧</div>
        <p class="tables-empty-text">No guests added yet</p>
      </div>
    `;
    return;
  }

  // Group guests by table, sort table names naturally
  const tableMap = {};
  guests.forEach(g => {
    const key = g.table || "Unassigned";
    if (!tableMap[key]) tableMap[key] = [];
    tableMap[key].push(g.name);
  });

  const sorted = Object.keys(tableMap).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );

  grid.innerHTML = sorted.map((table, i) => {
    const names = tableMap[table];
    const rows = names
      .map(n => `
        <div class="table-guest-row">
          <div class="table-guest-dot"></div>
          <span class="table-guest-name">${escHtml(n)}</span>
        </div>
      `)
      .join("");

    return `
      <div class="table-card" style="animation-delay:${i * 50}ms">
        <div class="table-card-header">
          <span class="table-card-name">${escHtml(table)}</span>
          <span class="table-card-count">${names.length} guest${names.length !== 1 ? "s" : ""}</span>
        </div>
        <div class="table-card-guests">${rows}</div>
      </div>
    `;
  }).join("");
}

/* ─── Admin ─────────────────────────────────────────── */
function openAdmin() {
  document.getElementById("admin-overlay").classList.remove("hidden");
  renderAdminList();
}

function closeAdmin() {
  document.getElementById("admin-overlay").classList.add("hidden");
}

function addGuest() {
  const nameEl       = document.getElementById("admin-name");
  const tableEl      = document.getElementById("admin-table");
  const companionsEl = document.getElementById("admin-companions");

  const name  = nameEl.value.trim();
  const table = tableEl.value.trim();
  const companions = companionsEl.value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (!name || !table) {
    if (!name) flashInvalid(nameEl);
    if (!table) flashInvalid(tableEl);
    return;
  }

  guests.push({ name, table, companions });
  saveGuests();
  renderAdminList();
  updateGuestCount();

  nameEl.value = "";
  tableEl.value = "";
  companionsEl.value = "";
  nameEl.focus();

  handleSearch();
}

function deleteGuest(i) {
  guests.splice(i, 1);
  saveGuests();
  renderAdminList();
  updateGuestCount();
  handleSearch();
}

function renderAdminList() {
  const list = document.getElementById("admin-list");
  if (!list) return;

  if (guests.length === 0) {
    list.innerHTML = `<p style="font-size:0.78rem;color:var(--ink-muted);padding:0.8rem 0">No guests yet — add one above</p>`;
    return;
  }

  list.innerHTML = guests.map((g, i) => `
    <div class="admin-row">
      <div class="admin-row-info">
        <div class="admin-row-name">${escHtml(g.name)}</div>
        <div class="admin-row-meta">${escHtml(g.table)}${g.companions?.length ? " · " + g.companions.length + " companion" + (g.companions.length > 1 ? "s" : "") : ""}</div>
      </div>
      <button class="btn-del" onclick="deleteGuest(${i})" title="Remove">✕</button>
    </div>
  `).join("");
}

function updateGuestCount() {
  const el = document.getElementById("guest-count");
  if (el) el.textContent = `(${guests.length})`;
}

/* ─── Export / Import ───────────────────────────────── */
function exportData() {
  const blob = new Blob([JSON.stringify(guests, null, 2)], { type: "application/json" });
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(blob),
    download: "wedding-guests.json"
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw new Error();
      guests = data.filter(g => g.name && g.table);
      saveGuests();
      renderAdminList();
      updateGuestCount();
      handleSearch();
    } catch {
      alert("Import failed — please use a valid wedding-guests.json file.");
    }
    e.target.value = "";
  };
  reader.readAsText(file);
}

function clearAll() {
  if (!confirm("Remove all guests? This cannot be undone.")) return;
  guests = [];
  saveGuests();
  renderAdminList();
  updateGuestCount();
  handleSearch();
}

/* ─── Helpers ───────────────────────────────────────── */
function escHtml(s) {
  return String(s)
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function flashInvalid(el) {
  el.style.borderColor = "#b94040";
  setTimeout(() => (el.style.borderColor = ""), 1200);
}
