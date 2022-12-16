import React, { useState } from 'react';
import './FormCard.scss';
import { useEffect } from 'react';
import Button from '../button/Button';
import {
    checkBalance,
    enterOppo,
    newReveal,
    serializePlayer,
    setupPlayerTicketsSizeFace,
    setupPlayerTicketsSizeProbability,
    generateTicket,
} from '../../service/ticket.service';
import { Player } from '../../model/player.model';
import { checkField } from '../../service/utils/errorUtils';
import { IoMdCopy } from 'react-icons/io';

let infos = ['', 'aa', ''];
let player: Player = {
    name: 'player',
    key: '',
    amount: 0,
    ratio: 0,
    reveal: { str: '', hash: '' },
    share: '',
};
let oppo: Player = {
    name: 'opponent',
    key: '',
    amount: 0,
    ratio: 0,
    reveal: { str: '', hash: '' },
    share: '',
};

const FormCard = () => {
    const [step, setStep] = useState<number>(0);
    const [question, setQuestion] = useState<string>('');
    const [answer, setAnswer] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [placeholder, setPlaceholder] = useState<string>('');

    const questions = [
        'What is your adress? ',
        'What size face value do you want to use? ',
        'What win probability do you want to use (value between 0 and 1)?',
    ];

    const setAction = () => {
        setError('');
        let nextStep = step;
        setPlaceholder('Address');
        switch (step) {
            case 0:
                if (!checkField(answer, false, false)) {
                    player.key = answer;
                    player.account = answer;
                    const [balance, escrow] = checkBalance(answer);
                    try {
                        player.reveal = newReveal(answer);
                        infos[1] = `Your account balance is ${balance} and your escrow is ${escrow}`;
                        setAnswer('');
                        setPlaceholder('Size face');
                        nextStep = step + 1;
                    } catch (error) {
                        console.log(error);
                        console.log('End of try-catch block');
                    }
                } else {
                    setError(checkField(answer, false, false));
                }
                break;
            case 1:
                if (!checkField(answer, true, false)) {
                    player = setupPlayerTicketsSizeFace(player, answer);
                    setAnswer('');
                    setPlaceholder('Probability');
                    nextStep = step + 1;
                } else {
                    setError(checkField(answer, true, false));
                }
                break;
            case 2:
                if (!checkField(answer, true, true)) {
                    player = setupPlayerTicketsSizeProbability(player, answer);
                    infos[3] =
                        'Send this setup code to your opponent: ' +
                        serializePlayer(player);
                    setAnswer('');
                    nextStep = step + 1;
                    setPlaceholder('Opponent player code');
                } else {
                    setError(checkField(answer, true, true));
                }
                break;
            case 3:
                infos[3] = 'Enter opponent player code';
                enterOppo(answer);
                nextStep = step + 1;
                break;
            default:
                console.warn('No action for step number ' + step);
        }

        setStep(nextStep);
        setQuestion(questions[nextStep]);
    };

    const handlePayAction = () => {
        generateTicket(player, oppo);
    };

    const handleClaimAction = () => {};

    const handleInfoAction = () => {};

    const updateAnswerValue = (evt: any) => {
        const val = evt.target.value;
        setAnswer(val);
    };
    const copyValue = () => {
        // Copy the text inside the text field
        navigator.clipboard.writeText(infos[step]);
    };

    useEffect(() => {
        setQuestion(questions[0]);
    }, []);

    return (
        <div className="FormCard overflow-hidden shadow-lg rounded-lg h-90 w-96 md:w-4/5 m-auto p-1">
            <h2 className="text-2xl break-all">{infos[step]}</h2>
            {step === 3 && <IoMdCopy className="copy" onClick={copyValue} />}
            <div className=" relative ">
                <label className="text-gray-700">{question}</label>
                <input
                    type="text"
                    id="name-with-label"
                    className=" rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent mt-2 mb-2"
                    name="answer"
                    placeholder={placeholder}
                    value={answer}
                    onChange={(evt) => updateAnswerValue(evt)}
                />
                {!!error && (
                    <span className="text-red-500 text-sm">{error}</span>
                )}
                {step !== 4 && <Button name="Continue" action={setAction} />}
                {step === 4 && (
                    <div className="buttons">
                        <div className="button-container">
                            <Button name="Pay" action={handlePayAction} />
                        </div>
                        <div className="button-container">
                            <Button name="Claim" action={handleClaimAction} />
                        </div>
                        <div className="button-container">
                            <Button name="Info" action={handleInfoAction} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FormCard;
