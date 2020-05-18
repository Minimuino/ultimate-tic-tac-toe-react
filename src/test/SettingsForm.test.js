import React from "react";
import renderer from "react-test-renderer";
import GameSettings, { dropdownOptions } from "../components/GameSettings";

var players = {};

function updatePlayers(p) {
  players = p;
}

describe("GameSettingsForm", () => {
  test("Test update", () => {
    const settings = renderer.create(
      <GameSettings callBackPlayer={updatePlayers} />
    );
    const root = settings.root;
    const dropdownPlayer1 = root.findByProps({ name: "p1" });
    dropdownPlayer1.props.onChange(null, dropdownOptions[1]);

    expect(players.p1).toBe(dropdownOptions[1].text);
    expect(true).toBe(true);
  });
});
