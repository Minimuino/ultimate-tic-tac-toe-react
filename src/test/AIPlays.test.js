import React from 'react';
import renderer from "react-test-renderer"

import App from "../App"
import SettingsForm, { dropdownOptions } from '../components/SettingsForm';
import Game from '../components/Game';
import Square, { squareColors } from "../components/Square"

describe("Ai plays", () => {


    test("select ai p1 vs human", () => {
        const app = renderer.create(<App />)
        const instance = app.root
        const settings = instance.findByType(SettingsForm)
        const game = instance.findByType(Game)
        const squares = game.findAllByType(Square)

        expect(squares.filter(x => containsXorO(x.props.children)).length).toBe(0)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("Next player: X")

        const dropDownPlayer1 = settings.findByProps({ name: "p1" })
        dropDownPlayer1.props.onChange(null, dropdownOptions[1])


        expect(squares.filter(x => containsXorO(x.props.children)).length).toBe(1)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("Next player: O")


        expect(true).toBe(true)
    })

    test("select ai p1 vs ai p2", () => {
        const app = renderer.create(<App />)
        const instance = app.root
        const settings = instance.findByType(SettingsForm)
        const game = instance.findByType(Game)
        const squares = game.findAllByType(Square)

        expect(squares.filter(x => containsXorO(x.props.children)).length).toBe(0)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("Next player: X")

        const dropDownPlayer1 = settings.findByProps({ name: "p1" })
        dropDownPlayer1.props.onChange(null, dropdownOptions[1])
        const dropDownPlayer2 = settings.findByProps({ name: "p2" })
        dropDownPlayer2.props.onChange(null, dropdownOptions[1])

        expect(squares.filter(x => isClickAble(x)).length).toBe(0)

        expect(true).toBe(true)
    })

    function isClickAble(x) {
        return x.props.style.background === squareColors.CLICKABLE
    }

    function containsXorO(x) {
        return x && (x.includes("X") || x.includes("O"));
    }
})