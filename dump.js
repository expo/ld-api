async function dumpAsync() {
  let ldgames = require("./ldgames");
  // let sqlite = require("./sqlite");

  let flat = Object.values(ldgames.info);

  // let db = await sqlite.db$;
  let db = require("./db");

  let stmt = `INSERT INTO ludum_dare_games (
    id,
    parent,
    superparent,
    author,
    type,
    subtype,
    subsubtype,
    published,
    created,
    modified,
    version,
    slug,
    name,
    body,
    neta_cover,
    meta_author_json,
    meta_grade_06_out,
    meta_grade_07_out,
    path,
    parents_json,
    love,
    notes,
    notes_timestamp,
    grade_grade_01,
    grade_grade_02,
    grade_grade_03,
    grade_grade_04,
    grade_grade_05,
    grade_grade_06,
    grade_grade_07,
    grade_grade_08,
    magic_grade,
    magic_given,
    magic_feedback,
    magic_smart,
    magic_cool,
    magic_grade_01_average,
    magic_grade_01_result,
    magic_grade_02_average,
    magic_grade_02_result,
    magic_grade_03_average,
    magic_grade_03_result,
    magic_grade_04_average,
    magic_grade_04_result,
    magic_grade_05_average,
    magic_grade_05_result,
    magic_grade_06_average,
    magic_grade_06_result,
    magic_grade_07_average,
    magic_grade_07_result,
    magic_grade_08_average,
    magic_grade_08_result
  ) VALUES (
    $1::bigint, -- | id                     | bigint                      |             |
$2::bigint, -- | parent                 | bigint                      |             |
$3::bigint, -- | superparent            | bigint                      |             |
$4::bigint, -- | author                 | bigint                      |             |
$5::text, -- | type                   | character varying(255)      |             |
$6::text, -- | subtype                | character varying(255)      |             |
$7::text, -- | subsubtype             | character varying(255)      |             |
$8::timestamp, -- | published              | timestamp without time zone |             |
$9::timestamp, -- | created                | timestamp without time zone |             |
$10::timestamp, -- | modified               | timestamp without time zone |             |
$11::bigint, -- | version                | bigint                      |             |
$12::text, -- | slug                   | character varying(512)      |             |
$13::text, -- | name                   | character varying(512)      |             |
$14::text, -- | body                   | text                        |             |
$15::text, -- | neta_cover             | character varying(512)      |             |
$16::json, -- | meta_author_json       | json                        |             |
$17::text, -- | meta_grade_06_out      | character varying(255)      |             |
$18::text, -- | meta_grade_07_out      | character varying(255)      |             |
$19::text, -- | path     I              | character varying(512)      |             |
$20::json, -- | parents_json           | json                        |             |
$21::integer, -- | love                   | integer                     |             |
$22::integer, -- | notes                  | integer                     |             |
$23::timestamp, -- | notes_timestamp        | timestamp without time zone |             |
$24::integer, -- | grade_grade_01         | integer                     |             |
$25::integer, -- | grade_grade_02         | integer                     |             |
$26::integer, -- | grade_grade_03         | integer                     |             |
$27::integer, -- | grade_grade_04         | integer                     |             |
$28::integer, -- | grade_grade_05         | integer                     |             |
$29::integer, -- | grade_grade_06         | integer                     |             |
$30::integer, -- | grade_grade_07         | integer                     |             |
$31::integer, -- | grade_grade_08         | integer                     |             |
$32::integer, -- | magic_grade            | integer                     |             |
$33::integer, -- | magic_given            | integer                     |             |
$34::integer, -- | magic_feedback         | integer                     |             |
$35::numeric, -- | magic_smart            | numeric                     |             |
$36::numeric, -- | magic_cool             | numeric                     |             |
$37::numeric, -- | magic_grade_01_average | numeric                     |             |
$38::numeric, -- | magic_grade_01_result  | numeric                     |             |
$39::numeric, -- | magic_grade_02_average | numeric                     |             |
$40::numeric, -- | magic_grade_02_result  | numeric                     |             |
$41::numeric, -- | magic_grade_03_average | numeric                     |             |
$42::numeric, -- | magic_grade_03_result  | numeric                     |             |
$43::numeric, -- | magic_grade_04_average | numeric                     |             |
$44::numeric, -- | magic_grade_04_result  | numeric                     |             |
$45::numeric, -- | magic_grade_05_average | numeric                     |             |
$46::numeric, -- | magic_grade_05_result  | numeric                     |             |
$47::numeric, -- | magic_grade_06_average | numeric                     |             |
$48::numeric, -- | magic_grade_06_result  | numeric                     |             |
$49::numeric, -- | magic_grade_07_average | numeric                     |             |
$50::numeric, -- | magic_grade_07_result  | numeric                     |             |
$51::numeric, -- | magic_grade_08_average | numeric                     |             |
$52::numeric -- | magic_grade_08_result  | numeric                     |             |
  );`;

  for (let game of flat) {
    let g = game;
    global.g = game;
    console.log(g);
    await db.queryAsync(stmt, [
      g.id,
      g.parent,
      g.superparent,
      g.author,
      g.type,
      g.subtype,
      g.subsubtype,
      g.published,
      g.created,
      g.modified,
      g.version,
      g.slug,
      g.name,
      g.body,
      g.meta.cover,
      JSON.stringify(g.meta.author),
      g.meta["grade-06-out"],
      g.meta["grade-07-out"],
      g.path,
      JSON.stringify(g.parents),
      g.love,
      g.notes,
      g["notes-timestamp"],
      g.grade["grade-01"],
      g.grade["grade-02"],
      g.grade["grade-03"],
      g.grade["grade-04"],
      g.grade["grade-05"],
      g.grade["grade-06"],
      g.grade["grade-07"],
      g.grade["grade-08"],
      g.magic.grade,
      g.magic.given,
      g.magic.feedback,
      g.magic.smart,
      g.magic.cool,
      g.magic["grade-01-average"],
      g.magic["grade-01-result"],
      g.magic["grade-02-average"],
      g.magic["grade-02-result"],
      g.magic["grade-03-average"],
      g.magic["grade-03-result"],
      g.magic["grade-04-average"],
      g.magic["grade-04-result"],
      g.magic["grade-05-average"],
      g.magic["grade-05-result"],
      g.magic["grade-06-average"],
      g.magic["grade-06-result"],
      g.magic["grade-07-average"],
      g.magic["grade-07-result"],
      g.magic["grade-08-average"],
      g.magic["grade-08-result"]
    ]);
    console.log("Inserted game id " + g.id);
  }
}

module.exports = {
  dumpAsync
};
