import { useState, useEffect } from "react";
import bLueCandy               from './images/blue-candy.png'
import greenCandy              from './images/green-candy.png'
import orangeCandy             from './images/orange-candy.png'
import purpleCandy             from './images/purple-candy.png'
import redCandy                from './images/red-candy.png'
import yellowCandy             from './images/yellow-candy.png'
import blank                   from './images/blank.png'

const width       = 8;
const candyColors = [
    bLueCandy,
    greenCandy,
    orangeCandy,
    purpleCandy,
    redCandy,
    yellowCandy
]

const App = () => {
    const [ currentColorArrangerment, setCurrentColorArrangerment ] = useState([]);
    const [ squareBeingDragged, setSquareBeingDragged ]             = useState(null);
    const [ squareBeingReplaced, setSquareBeingReplaced ]           = useState(null);

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columOfFour  = [ i, i + width, i + width * 2, i + width * 3 ];
            const decidedColor = currentColorArrangerment[i]

            if (columOfFour.every(square => currentColorArrangerment[square] === decidedColor)) {
                columOfFour.forEach(square => currentColorArrangerment[square] = blank)
                return true

            }
        }
    }

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour    = [ i, i + 1, i + 2, i + 3 ];
            const decidedColor = currentColorArrangerment[i]
            const notValid     = [ 5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53, 54, 55, 62, 63, 64 ]
            if (notValid.includes(i)) continue

            if (rowOfFour.every(square => currentColorArrangerment[square] === decidedColor)) {
                rowOfFour.forEach(square => currentColorArrangerment[square] = blank)
            }
        }
    }

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columOfThree = [ i, i + width, i + width * 2 ];
            const decidedColor = currentColorArrangerment[i]

            if (columOfThree.every(square => currentColorArrangerment[square] === decidedColor)) {
                columOfThree.forEach(square => currentColorArrangerment[square] = blank)
                return true
            }
        }
    }

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree   = [ i, i + 1, i + 2 ];
            const decidedColor = currentColorArrangerment[i]
            const notValid     = [ 6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55, 63, 64 ]
            if (notValid.includes(i)) continue

            if (rowOfThree.every(square => currentColorArrangerment[square] === decidedColor)) {
                rowOfThree.forEach(square => currentColorArrangerment[square] = blank)
            }
        }
    }

    const moveIntoSquareBelow = () => {
        for (let i = 0; i <= 55 - width; i++) {
            const firstRow   = [ 0, 1, 2, 3, 4, 5, 6, 7 ]
            const isFirstRow = firstRow.includes(i)

            if (isFirstRow && currentColorArrangerment[i] === blank) {
                let randomNumber            = Math.floor(Math.random() * candyColors.length)
                currentColorArrangerment[i] = candyColors[randomNumber]
            }

            if ((currentColorArrangerment[i + width]) === blank) {
                currentColorArrangerment[i + width] = currentColorArrangerment[i]
                currentColorArrangerment[i]         = blank
            }
        }
    }

    const dragStart = (e) => {
        console.log(e.target);
        console.log('dragStart')
        setSquareBeingDragged(e.target)
    }

    const dragDrop = (e) => {
        console.log(e.target);
        console.log('dragDrop')
        setSquareBeingReplaced(e.target)
    }

    const dragEnd = (e) => {
        console.log('dragEnd')

        const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
        const squareBeingReplaceId = parseInt(squareBeingReplaced.getAttribute('data-id'))

        currentColorArrangerment[squareBeingReplaceId] = squareBeingDragged.getAttribute('src')
        currentColorArrangerment[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')


        console.log('squareBeingDraggedId', squareBeingDraggedId);
        console.log('squareBeingReplaceId', squareBeingReplaceId);

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - width,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + width
        ]

        const validMove = validMoves.includes(squareBeingReplaceId)

        const isAColumnOfFour  = checkForColumnOfFour()
        const isARowOfFour     = checkForRowOfFour()
        const isAColumnOfThree = checkForColumnOfThree()
        const isARowOfThree    = checkForRowOfThree()

        if (squareBeingReplaceId && validMove && (isARowOfThree || isAColumnOfThree || isARowOfFour || isAColumnOfFour)) {
            setSquareBeingDragged(null)
            setSquareBeingReplaced(null)
        } else {
            currentColorArrangerment[squareBeingReplaceId] = squareBeingReplaced.getAttribute('src')
            currentColorArrangerment[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
            setCurrentColorArrangerment([ ...currentColorArrangerment ])
        }
    }

    const createBoard = () => {
        const randomColorArragment = []

        for (let i = 0; i < width * width; i++) {
            const randomColor = candyColors[Math.floor(Math.random() * candyColors.length)]
            randomColorArragment.push(randomColor)
        }
        setCurrentColorArrangerment(randomColorArragment)
    }

    useEffect(() => {
        createBoard()
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            checkForColumnOfFour()
            checkForRowOfFour()
            checkForColumnOfThree()
            checkForRowOfThree()
            moveIntoSquareBelow()
            setCurrentColorArrangerment([ ...currentColorArrangerment ])
        }, 100)
        return () => clearInterval(timer)

    }, [ checkForColumnOfFour, checkForRowOfFour, checkForColumnOfThree, checkForRowOfThree, moveIntoSquareBelow, currentColorArrangerment ]);

    return (
        <div className="app">
            <div className="game">
                { currentColorArrangerment.map((candyColors, index) => (
                    <img
                        key={ index }
                        src={ candyColors }
                        alt={ candyColors }
                        style={ { backgroundColor: candyColors } }
                        data-id={ index }
                        draggable={ true }
                        onDragStart={ dragStart }
                        onDragOver={ (e) => e.preventDefault() }
                        onDragEnter={ (e) => e.preventDefault() }
                        onDragLeave={ (e) => e.preventDefault() }
                        onDrop={ dragDrop }
                        onDragEnd={ dragEnd }
                    />
                )) }
            </div>
        </div>
    );
}

export default App;
