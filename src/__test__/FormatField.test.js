

export const startPoint = {
  field: [
    "X X X|X X X|X X -",
    "- - -|- - -|- - -",
    "O O -|O O -|- - -",

    "- - -|- - -|- - -",
    "- - -|- - -|- - -",
    "- - -|- - -|- - -",

    "- - -|- - O|- - -",
    "- - -|- - -|- - -",
    "- - -|- - -|- - -",
  ],
  lastMove: { row: 0, col: 2, outerRow: 2, outerCol: 2 },
};

function formatField(field) {
  var squares = Array(9).fill(null).map(() => Array(9).fill(null));

  for (let row_i = 0; row_i < field.length; row_i++) {
    let outer_row_element = field[row_i].replace(/\s/g, "").split("|")
    for (let outer_col_i = 0; outer_col_i < outer_row_element.length; outer_col_i++) {
      let inner_elements = outer_row_element[outer_col_i].split("")
      for (let inner_col_i = 0; inner_col_i < inner_elements.length; inner_col_i++) {
        let e = ((inner_elements[inner_col_i] === "-") ? null : inner_elements[inner_col_i])
        squares[Math.floor(row_i / 3) * 3 + outer_col_i][(row_i % 3) * 3 + inner_col_i] = e
      }
    }
  }
  return squares;
}

describe("formatField", () => {
  test("test formatting", () => {
    const result = [
      ["X", "X", "X", null, null, null, "O", "O", null],
      ["X", "X", "X", null, null, null, "O", "O", null],
      ["X", "X", null, null, null, null, null, null, null],
      //
      Array(9).fill(null),
      Array(9).fill(null),
      Array(9).fill(null),
      //
      Array(9).fill(null),
      [null, null, "O", null, null, null, null, null, null],
      Array(9).fill(null),
    ];

    const format = formatField(startPoint.field)
    expect(format.length).toBe(result.length);
    expect(format.map(x => x.length)).toEqual(result.map(x => x.length));
    expect(format).toEqual(result);
  });
});

export default formatField