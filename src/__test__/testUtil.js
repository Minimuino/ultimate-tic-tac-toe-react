import { squareColors } from "../components/Square"

export function containsXorO(x) {
    return x && (x.includes("X") || x.includes("O"));
}

export function isClickAble(x) {
    return x.props.style.background === squareColors.CLICKABLE
}
