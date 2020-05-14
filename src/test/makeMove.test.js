
import React from "react"
import Game from "../components/Game"

import renderer from "react-test-renderer"


import { squareColors } from "../components/Square"

describe("onclick", () => {


    test("current: makeon click", () => {
        const game = renderer.create(<Game key={0}
            size={3}
            clock={false}
            time={10}
            renderInfo={true}
            aiIs={'O'} />) // only renders the first lvl

        const instance = game.root
        const squares = instance.findAll(el => el.props.className === "square")
        // console.log(squares[0])
        //console.log(squares[0]._fiber.child.stateNode.text)
        expect(squares.filter(x => containsXorO(x.props.children)).length).toBe(0)

        squares[0].props.onClick();
        expect(squares.filter((x) => containsXorO(x.props.children)).length).toBe(1)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("Next player: O")
        //geht doch ...
    });
    test("victory x", () => {
        const game = renderer.create(<Game key={0}
            size={3}
            clock={false}
            time={10}
            renderInfo={true}
            aiIs={'O'} />)

        const instance = game.root
        const squares = instance.findAll(el => el.props.className === "square")
        expect(squares.filter((x) => isClickAble(x)).length).toBe(81)

        squares[33].props.onClick();
        squares[57].props.onClick();
        squares[34].props.onClick();
        squares[66].props.onClick();
        squares[35].props.onClick();
        squares[75].props.onClick();
        squares[42].props.onClick();
        squares[58].props.onClick();
        squares[43].props.onClick();
        squares[67].props.onClick();
        squares[44].props.onClick();
        squares[76].props.onClick();
        squares[51].props.onClick();
        squares[59].props.onClick();
        squares[52].props.onClick();
        squares[68].props.onClick();
        squares[53].props.onClick();

        console.log(squares[0].props);
        expect(squares.filter((x) => isClickAble(x)).length).toBe(0)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("X wins!")
    })

    function isClickAble(x) {
        return x.props.style.background === squareColors.CLICKABLE
    }

    test("victory O", () => {
        const game = renderer.create(<Game key={0}
            size={3}
            clock={false}
            time={10}
            renderInfo={true}
            aiIs={'O'} />)

        const instance = game.root
        const squares = instance.findAll(el => el.props.className === "square")
        expect(squares.filter((x) => isClickAble(x)).length).toBe(81)

        squares[3].props.onClick();
        squares[33].props.onClick();
        squares[57].props.onClick();
        squares[34].props.onClick();
        squares[66].props.onClick();
        squares[35].props.onClick();
        squares[75].props.onClick();
        squares[42].props.onClick();
        squares[58].props.onClick();
        squares[43].props.onClick();
        squares[67].props.onClick();
        squares[44].props.onClick();
        squares[76].props.onClick();
        squares[51].props.onClick();
        squares[59].props.onClick();
        squares[52].props.onClick();
        squares[68].props.onClick();
        squares[53].props.onClick();

        console.log(squares[0].props);
        expect(squares.filter((x) => isClickAble(x)).length).toBe(0)
        expect(instance.findByProps({ id: "status" }).props.children).toEqual("O wins!")
    })

    //test new game





    /*    test("future: ai is O", () => {
                //enzym would be shallow .instance
            const inst = ReactTestUtils.renderIntoDocument(<Game key={0}
                size={3}
                clock={false}
                time={10}
                renderInfo={true}
                aiIs={'O'} />); // only renders the first lvl
            expect(inst.state.squares.filter(x => containsXorO(x)).length).toBe(0)
    
            inst.handleClick(0, 8)
            expect(inst.state.squares.filter((x) => containsXorO(x)).length).toBe(2)
            expect(inst.state.xIsNext).toBe(true)
        });*/

    function containsXorO(x) {
        return x && (x.includes("X") || x.includes("O"));
    }
});