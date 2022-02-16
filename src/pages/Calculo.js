import React, { useEffect, useState, Fragment } from 'react';
import Instruction from '../components/TejasLee/Instruction'
import { useAlert } from 'react-alert'

// Import Swiper React components
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { get, set, getMany, update } from 'idb-keyval';
import Item from '../components/Item';
import Quantification from '../components/Calculo/Quantification';
import QuantificationQuiz from '../components/Calculo/QuantificationQuiz';

export default function Calculo () {

    const alert = useAlert()
    const [numbers, setNumbers] = useState([])
    const [quantification, setQuantification] = useState([])
    const [verbalCount, setVerbalCount] = useState([])
    const [problemsWithoutMedia, setProblemsWithoutMedia] = useState([])
    const [problems, setProblems] = useState([])
    const [isArray, setIsArray] = useState(false)


/* 
allInstruments.forEach(instrument => {if(instrument['Cálculo'] != undefined) {console.log(instrument['key'], instrument['Cálculo'].value)} else {console.log(instrument['key'], instrument['Cálculo-selected'].value)}})
 */
    useEffect(() => {

        

        get('instrument/2')
        .then(
            items => {
            setNumbers(items.filter(item => item.itemId >= 73 && item.itemId <= 89))
            setQuantification(items.filter(item => item.itemId >= 90 && item.itemId <= 110))
            setVerbalCount(items.filter(item => item.itemId === 111))
            setProblemsWithoutMedia(items.filter(item => item.itemId >= 112 && item.itemId <= 113))
            setProblems(items.filter(item => item.itemId >= 114 && item.itemId <= 145)) 
        })

        /* var piece = document.querySelector(".piece") */
        var landingArea = document.querySelector(".landing-area")
        var pieces = document.querySelectorAll(".piece")
        addListenersToPieces(pieces, landingArea)
        
        
        
        
    }, [])

    console.log(quantification)

    function saveInstrumentOnline() {
        let choices = {}
        let instrumentInfo = {}
        let choicesArray = []

        let testDataArray = ['selectedStudent', 'userData']

        getMany(testDataArray).then(([firstVal, secondVal]) =>  {
            instrumentInfo['user_id'] = parseInt(secondVal['id'])
            instrumentInfo['student_id'] = parseInt(firstVal)
            instrumentInfo['date'] = `${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}`
        }
        );

        choicesArray.push(instrumentInfo)

        let allInstruments = document.querySelectorAll('.instrument-form')
        allInstruments.forEach(instrument => {
            let key;
            let value;
            if (instrument['Cálculo']) {
                key = instrument['key'].value
                value= instrument['Cálculo'].value
            } else if (instrument['Cálculo-selected']) {
                key = instrument['key'].value
                value= instrument['Cálculo-selected'].value
            } else if (instrument['Cálculo-counted']) {
                key = instrument['key'].value
                value= instrument['Cálculo-counted'].value
            } else if (instrument['Cálculo-cardinal']) {
                key = instrument['key'].value
                value= instrument['Cálculo-cardinal'].value
            }

            choices[key] =  value
        })

        instrumentInfo['instrument'] = parseInt(allInstruments[0]['instrument'].value)

        choicesArray.push(choices)

        get('completedTests')
        .then(response => {

            if (!isArray) {
                if (response.length === undefined) {
                    update('completedTests', (val) => 
                    [response , choicesArray])         
                    setIsArray(true)
                } else if (response.length === 0) {
                    set('completedTests', [choicesArray])
                } else {
                    console.log(response, "Actualizando1")
                    let arrayCounter = 0;
                    response.forEach(array => {
                        
                        if (array[0]['student_id'] === instrumentInfo['student_id'] && array[0]['instrument'] == instrumentInfo['instrument']) {
                            console.log(response, arrayCounter)
                            response.splice(arrayCounter, 1)
                            
                
                        }
                        arrayCounter+= 1

                    })

                    update('completedTests', val => [...response, choicesArray])

                    
                }
            } else {
                console.log(response, "Actualizando2")
                update('completedTests', val => [...response, choicesArray])

            }

            alert.show('Test guardado con éxito', {
                type:'success'
            })

        })   
    }

    
    function addListenersToPieces (pieces, landingArea) {

        pieces.forEach(piece => {

            let baseX = piece.offsetLeft
            let baseY = piece.offsetTop;

            piece.addEventListener("touchstart", e => {
                piece.style.position = 'absolute';

            })
    
            piece.addEventListener('touchmove', function(e) {
    
                e.preventDefault()
                var touchLocation = e.targetTouches[0];
                    
                // assign box new coordinates based on the touch.
                piece.style.left = touchLocation.pageX + 'px';
                piece.style.top = touchLocation.pageY + 'px';
            })          

            piece.addEventListener('touchend', function(e) {
                // current box position.
                var x = parseInt(piece.style.left);
                var y = parseInt(piece.style.top);

                let newPiece = `<div class='piece-inside'><div/>`

                if (y > 2 && y < 500 && x > 540 && x < 940) {
                    piece.style.display = 'none'

                    landingArea.insertAdjacentHTML("afterbegin", newPiece)
                }
                if (x < 140 || x > 530) {
                    piece.style.left = `${baseX}px`
                    piece.style.top= `${baseY}px`

                }
                if (y < 10 || y > 500){
                    piece.style.left = `${baseX}px`
                    piece.style.top= `${baseY}px`

                }

            })
        })


    }

    function restartGame () {
        const $piecesContainer = document.querySelector(".pieces-container")
        const $landingArea = document.querySelector(".landing-area")
        
        let basePieces = "<div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div><div class='piece'></div>"
      
        $landingArea.innerHTML = ""
        $piecesContainer.innerHTML = basePieces
        var pieces = document.querySelectorAll(".piece")
        var landingArea = document.querySelector(".landing-area")
        addListenersToPieces(pieces, landingArea)
    }

    return (
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            navigation
            allowTouchMove={false}
            scrollbar={{ draggable: true }}
        >

        <SwiperSlide>
            <Instruction instruction="A continuación haremos algunas actividades con números, aquí no hay respuesta buenas ni malas. Si hay algo que no sabes está bien, haz lo mejor que puedas"/>
        </SwiperSlide>
        <SwiperSlide>
            <Instruction instruction="Te voy a mostrar unos números, y te voy a pedir que me digas cómo se llaman. ¿Lo has entendido? Comencemos "/>
        </SwiperSlide>
        {
                numbers.map(item => 
                    <Fragment>                           
                    <SwiperSlide key={item.itemId+ "-media"}>
                        <Item
                            type={item.type}
                            picture={item.picture}
                            pictureName={item.pictureName}
                            title={item.title}
                        />
                    </SwiperSlide>
                    <SwiperSlide key={item.itemId}>
                        <Item
                            title = {item.title}       
                            type = "quiz"
                            other = {false}   
                            answer = {item.answer}
                            instrumentId = {item.instrumentId}
                            instrumentName = {item.instrumentName}          
                            num = {item.num}     
                            itemId = {item.itemId} 
                        />

                    </SwiperSlide>
                </Fragment>
                )
                }
        <SwiperSlide>
            <Instruction instruction="Vamos a hacer un juego. En esta pantalla aparecerán un montón de fichas rojas. Vas a mover aquí (señalar la tablet), el número de fichas que yo te diga. Vamos a hacer un ejemplo"/>
        </SwiperSlide>

        <SwiperSlide>
        <div className='containerBox'>

            <div className='pieces-container'>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
                <div className='piece'></div>
            </div>
            <div className="landing-area">
                
            </div>
        </div>
        <button
            className="button restart-button"
            onClick={restartGame}
        >Restart</button>
        </SwiperSlide>

        {
            quantification[0] != undefined &&

        <Fragment>

                
        <SwiperSlide key="1">
                <Quantification key={quantification[0].itemId} quantity={20} num={1} repeat={true} title={"Coloca tres fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="2">
                <Quantification key={quantification[0].itemId} quantity={20} num={2} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="3">
                <QuantificationQuiz title={quantification[0].title} itemId={[quantification[0].itemId, quantification[1].itemId, quantification[2].itemId]} instrumentName={quantification[0].instrumentName} num={quantification[0].num}/>
        </SwiperSlide>
        <SwiperSlide key="4">
                <Quantification key={quantification[3].itemId} quantity={20} num={3} repeat={true} title={"Coloca cuatro fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="5">
                <Quantification key={quantification[3].itemId} quantity={20} num={4} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="6">
                <QuantificationQuiz title={quantification[3].title} itemId={[quantification[3].itemId, quantification[4].itemId, quantification[5].itemId]} instrumentName={quantification[3].instrumentName} num={quantification[3].num}/>
        </SwiperSlide>
        <SwiperSlide key="7">
                <Quantification key={quantification[6].itemId} quantity={20} num={5} repeat={true} title={"Coloca seis fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="8">
                <Quantification key={quantification[6].itemId} quantity={20} num={6} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="9">
                <QuantificationQuiz title={quantification[6].title} itemId={[quantification[6].itemId, quantification[7].itemId, quantification[8].itemId]} instrumentName={quantification[6].instrumentName} num={quantification[6].num}/>
        </SwiperSlide>
        <SwiperSlide key="10">
                <Quantification key={quantification[9].itemId} quantity={20} num={7} repeat={true} title={"Coloca ocho fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="11">
                <Quantification key={quantification[9].itemId} quantity={20} num={8} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="12">
                <QuantificationQuiz title={quantification[9].title} itemId={[quantification[9].itemId, quantification[10].itemId, quantification[11].itemId]} instrumentName={quantification[9].instrumentName} num={quantification[9].num}/>
        </SwiperSlide>
        <SwiperSlide key="13">
                <Quantification key={quantification[12].itemId} quantity={20} num={9} repeat={true} title={"Coloca diez fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="14">
                <Quantification key={quantification[12].itemId} quantity={20} num={10} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="15">
                <QuantificationQuiz title={quantification[12].title} itemId={[quantification[12].itemId, quantification[13].itemId, quantification[14].itemId]} instrumentName={quantification[12].instrumentName} num={quantification[12].num}/>
        </SwiperSlide>
        <SwiperSlide key="16">
                <Quantification key={quantification[15].itemId} quantity={20} num={11} repeat={true} title={"Coloca once fichas aquí"}/>
        </SwiperSlide> 
        <SwiperSlide key="17">
                <Quantification key={quantification[15].itemId} quantity={20} num={12} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="18">
                <QuantificationQuiz title={quantification[15].title} itemId={[quantification[15].itemId, quantification[16].itemId, quantification[17].itemId]} instrumentName={quantification[15].instrumentName} num={quantification[15].num}/>
        </SwiperSlide>
        <SwiperSlide key="19">
                <Quantification key={quantification[18].itemId} quantity={20} num={13} repeat={true} title={"Coloca dieciseis fichas aquí"}/>
        </SwiperSlide>
        <SwiperSlide key="20">
                <Quantification key={quantification[18].itemId} quantity={20} num={14} title={"Ahora las vas a contar y me vas a decir cuantas tocaste"}/>
        </SwiperSlide>
        <SwiperSlide key="21">
                <QuantificationQuiz title={quantification[18].title} itemId={[quantification[18].itemId, quantification[19].itemId, quantification[20].itemId]} instrumentName={quantification[18].instrumentName} num={quantification[18].num}/>
        </SwiperSlide>

            </Fragment>
        }

        {
            verbalCount.map(
                item => 

                    <SwiperSlide>
                        <Item
                            title = {item.title}       
                            type = "quiz"
                            other = {false}   
                            answer = {item.answer}
                            instrumentId = {item.instrumentId}
                            instrumentName = {item.instrumentName}          
                            num = {item.num}     
                            itemId = {item.itemId} 
                        />
                    </SwiperSlide>
               
            )
        }

        <SwiperSlide>
            <Instruction instruction="A continuación te haré algunas preguntas y te mostraré algunas imágenes"/>
        </SwiperSlide>

        {
            problemsWithoutMedia.map(
                item => 
                <SwiperSlide key={item.itemId}>
                    <Item
                        title = {item.title}       
                        type = "quiz"
                        other = {false}   
                        answer = {item.answer}
                        instrumentId = {item.instrumentId}
                        instrumentName = {item.instrumentName}          
                        num = {item.num}     
                        itemId = {item.itemId} 
                    />

                </SwiperSlide>
            )
        }

        {
            problems.map(
                item => 

                
                <Fragment>                           
                <SwiperSlide key={item.itemId+ "-media"}>
                    <Item
                        type={item.type}
                        picture={item.picture}
                        pictureName={item.pictureName}
                        title={item.title}
                    />
                </SwiperSlide>
                <SwiperSlide key={item.itemId}>
                    <Item
                        title = {item.title}       
                        type = "quiz"
                        other = {false}   
                        answer = {item.answer}
                        instrumentId = {item.instrumentId}
                        instrumentName = {item.instrumentName}          
                        num = {item.num}     
                        itemId = {item.itemId} 
                    />

                </SwiperSlide>
            </Fragment>
               
            )
        }

        <SwiperSlide>
        <div className="page-item">
                        <button
                        
                            className='button btn btn-primary'
                            onClick={saveInstrumentOnline}
                        > Guardar test</button>

            </div>
        </SwiperSlide>
        </Swiper>
      );
}