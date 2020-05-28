import React from "react";

/*
 * Generates a grid of NxN elements. Expects 3 parameters:
 *
 ** className: A class-name for the CSS stylesheet. The global name of the
	grid will be equal to the provided className; the name of each row
	will be equal to className + '-row'.
 ** size: The grid's size.
 ** generatorFunction: Custom function to create each element. This function
    must take an integer as unique parameter and return a valid React element.
 */
export default function generateGridNxN(className, size, generatorFunction) {
  var rows = [];
  for (let i = 0; i < size; i++) {
    let cols = [];
    for (let j = 0; j < size; j++) {
      cols.push(generatorFunction(i * size + j));
    }
    rows.push(
      <div className={className + "-row"} key={i}>
        {cols}
      </div>
    );
  }
  return <div className={className}>{rows}</div>;
}
