import Web3 from 'web3';
import { Player } from '../model/player.model';

const contract = require('web3-eth-contract');
const createKeccakHash = require('keccak');

// set provider for all later instances to use
contract.setProvider(window.location.origin);

let web3 = new Web3(
    Web3.givenProvider ||
        'ws://' +
            window.location.origin.replace('https', '').replace('http', '')
);

let lotaddr = '0x6dB8381b2B41b74E17F5D4eB82E8d5b04ddA0a94';
let lotabi = JSON.parse(
    '[ { "inputs": [ { "internalType": "uint64", "name": "day", "type": "uint64" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "funder", "type": "address" }, { "indexed": true, "internalType": "address", "name": "signer", "type": "address" } ], "name": "Create", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "unlock_warned", "type": "uint256" } ], "name": "Delete", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "funder", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" } ], "name": "Enroll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "escrow_amount", "type": "uint256" } ], "name": "Update", "type": "event" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "components": [ { "internalType": "bytes32", "name": "data", "type": "bytes32" }, { "internalType": "bytes32", "name": "reveal", "type": "bytes32" }, { "internalType": "uint256", "name": "packed0", "type": "uint256" }, { "internalType": "uint256", "name": "packed1", "type": "uint256" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" } ], "internalType": "struct OrchidLottery1.Ticket[]", "name": "tickets", "type": "tuple[]" }, { "internalType": "bytes32[]", "name": "refunds", "type": "bytes32[]" } ], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "int256", "name": "adjust", "type": "int256" }, { "internalType": "int256", "name": "warn", "type": "int256" }, { "internalType": "uint256", "name": "retrieve", "type": "uint256" } ], "name": "edit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "int256", "name": "adjust", "type": "int256" }, { "internalType": "int256", "name": "warn", "type": "int256" }, { "internalType": "uint256", "name": "retrieve", "type": "uint256" } ], "name": "edit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "bool", "name": "cancel", "type": "bool" }, { "internalType": "address[]", "name": "recipients", "type": "address[]" } ], "name": "enroll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "funder", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "name": "enrolled", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "uint64", "name": "marked", "type": "uint64" } ], "name": "mark", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "onTokenTransfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "funder", "type": "address" }, { "internalType": "address", "name": "signer", "type": "address" } ], "name": "read", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "count", "type": "uint256" }, { "internalType": "bytes32", "name": "seed", "type": "bytes32" } ], "name": "save", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "tokenFallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]'
);
let lottery = new contract(lotabi, lotaddr);
let token = '0x0000000000000000000000000000000000000000';
let uint128 = Math.pow(2, 128) - 1;
let uint64 = Math.pow(2, 64) - 1;

/* import { w3 } from 'web3/auto';
import * as datetime from 'datetime';
import * as struct from 'struct';
import * as json from 'json';
import * as itertools from 'itertools';
import * as math from 'math';

let gnosisrpc = 'https://rpc.gnosischain.com/';
let w3 = new web3.Web3(new web3.HTTPProvider(gnosisrpc));


let addrtype = Math.pow(2, 20 * 8) - 1;


// let token = "0x" + "0" * 40; // TODO

// TODO
function to_32byte_hex(val: any) {
    return val;
}
*/
// TODO
function ticket(
    amount: any,
    reveal: any,
    ratio: any,
    funder: any,
    recipient: any,
    key: any
) {
    var data, digest, expire, issued, l2nonce, packed0, packed1, sig, tk;
    data = 'x00';
    issued = new Date().getTime();
    l2nonce =
        Number.parseInt(
            createKeccakHash('keccak256')
                .update('' + new Date().getTime())
                .digest('hex')
        ) &
        (Math.pow(2, 64) - 1);
    expire = Math.pow(2, 31) - 1;
    packed0 = (issued << 192) | (l2nonce << 128) | amount;
    packed1 = (expire << 224) | (ratio << 160) | Number.parseInt(funder);
    digest = web3.utils.soliditySha3(
        web3.eth.abi.encodeParameters(
            [
                'bytes1',
                'bytes1',
                'address',
                'bytes32',
                'address',
                'address',
                'bytes32',
                'uint256',
                'uint256',
                'bytes32',
            ],
            [
                '\u0019',
                '\u0000',
                lotaddr,
                0 * 31 + 'd',
                token,
                recipient,
                web3.utils.soliditySha3(
                    (web3 as any).eth.abi.encodeParameters(
                        ['bytes32'],
                        [reveal]
                    )
                ),
                packed0,
                packed1,
                data,
            ]
        )
    );

    sig = (web3 as any).eth.accounts.sign(digest, {
        private_key: key,
    });
    packed1 = (packed1 << 1) | ((sig.v - 27) & 1);
    tk = [
        data,
        web3.utils.asciiToHex(reveal),
        packed0,
        packed1,
        sig.r?.toString(32),
        sig.s?.toString(32),
    ];
    return tk;
}
/*
function claimTicket(tkt: any, plyr: any) {
    var func, l1nonce, signed, tx, txhash;
    l1nonce = w3.eth.get_transaction_count(plyr['account']);
    func = lottery.functions.claim(token, plyr['account'], [tkt], []);
    tx = func.buildTransaction({
        chainId: 100,
        gas: 70000,
        maxFeePerGas: w3.toWei('2', 'gwei'),
        maxPriorityFeePerGas: w3.toWei('1', 'gwei'),
        nonce: l1nonce,
    });
    signed = w3.eth.account.sign_transaction(tx, {
        private_key: plyr['key'],
    });
    txhash = w3.eth.send_raw_transaction(signed.rawTransaction);
    console.log('Claim transaction hash: ', txhash.hex());
}

function serializeTicket(tk: any) {
    return (
        tk[0].hex() +
        tk[1].hex() +
        to_32byte_hex(tk[2]).slice(2) +
        to_32byte_hex(tk[3]).slice(2) +
        tk[4].slice(2) +
        tk[5].slice(2)
    );
    return json.dumps([tk[0].hex(), tk[1].hex(), tk[2], tk[3], tk[4], tk[5]]);
}

function deserializeTicket(tstr: any) {
    let tk;

    tk = function () {
        var _pj_a = [],
            _pj_b = range(0, tstr.length, 64);

        for (var _pj_c = 0, _pj_d = _pj_b.length; _pj_c < _pj_d; _pj_c += 1) {
            var i = _pj_b[_pj_c];

            _pj_a.push(tstr.slice(i, i + 64));
        }

        return _pj_a;
    }.call(this);

    tk[2] = Number.parseInt(tk[2]);
    tk[3] = Number.parseInt(tk[3]);
    return tk;
}
*/

export const setupPlayerTicketsSizeFace = (plyr: Player, amount: string) => {
    plyr.amount = Number.parseFloat(amount) * Math.pow(10, 18);
    return plyr;
};
export const setupPlayerTicketsSizeProbability = (
    plyr: Player,
    prob: string
) => {
    plyr.ratio = Math.floor(uint64 * Number.parseFloat(prob));
    return plyr;
};

export const newReveal = (username: any) => {
    var hash, str;
    str = `${username}`;
    hash = createKeccakHash('keccak256').update(str).digest('hex');
    return {
        str: str,
        hash: hash,
    };
};
/*
var _pj;

function _pj_snippets(container) {
    function in_es6(left, right) {
        if (right instanceof Array || typeof right === 'string') {
            return right.indexOf(left) > -1;
        } else {
            if (
                right instanceof Map ||
                right instanceof Set ||
                right instanceof WeakMap ||
                right instanceof WeakSet
            ) {
                return right.has(left);
            } else {
                return left in right;
            }
        }
    }

    container['in_es6'] = in_es6;
    return container;
}

_pj = {};

_pj_snippets(_pj);

function printPlayer(plyr: any) {
    var account, balance, escrow;
    account = plyr['account'];
    console.log('Player: ', plyr['name']);

    if (_pj.in_es6('key', plyr)) {
        console.log('  Key: ', plyr['key'].hex());
    }

    if (_pj.in_es6('reveal', plyr)) {
        console.log('  Reveal: ', plyr['reveal']['hash']);
    }

    console.log('  L1/L2 Address: ', account);

    if (_pj.in_es6('amount', plyr)) {
        console.log(
            '  Ticket facevalues: {:.4f}'.format(plyr['amount'] / pow(10, 18))
        );
        console.log(
            '  Ticket win ratio: {:.2f}'.format(plyr['ratio'] / uint64)
        );
    }

    [balance, escrow] = checkBalance(account);
    console.log('  Balance: ', balance);
    console.log('  Escrow: ', escrow);
    console.log('  Player code: ', plyr['share']);
} */

export const checkBalance = (address: any) => {
    let balance, escrow;
    let escrowAmount = lottery.methods.read(token, address, address).call({
        block_identifier: 'latest',
    })[0];
    balance = escrowAmount & (uint128 / Math.pow(10, 18));
    escrow = escrowAmount >> (128 / Math.pow(10, 18));
    return [balance, escrow];
};

export const serializePlayer = (plyr: Player) => {
    return plyr.account + plyr.reveal.hash;
};

export const enterOppo = (opponentPlayerCode: string): Player => {
    return {
        name: 'opponent',
        key: '',
        amount: 0,
        ratio: 0,
        reveal: { str: '', hash: opponentPlayerCode.slice(42) },
        share: opponentPlayerCode,
        account: opponentPlayerCode.slice(0, 42),
    };
};

export const generateTicket = (plyr: Player, oppo: Player) => {
    var tk;

    if (oppo === null) {
        console.log(
            "Error! You must set up your opponent's info before you can pay them!"
        );
        return;
    }

    tk = ticket(
        plyr.amount,
        plyr.reveal.hash,
        plyr.ratio,
        plyr.account,
        oppo.account,
        plyr.key
    );
    console.log(tk);
};
/*
function isWinner(tk: any) {
    var comp, data, hash, nonce, packed0, packed1, r, ratio, reveal, s;
    [data, reveal, packed0, packed1, r, s] = tk;
    nonce = (packed0 >> 128) & uint64;
    ratio = uint64 & (packed1 >> 161);
    hash = web3.Web3.solidityKeccak(
        ['uint256', 'uint128'],
        [Number.parseInt(reveal), nonce]
    );
    comp = uint64 & Number.parseInt(hash.hex());

    if (ratio < comp) {
        return false;
    }

    return true;
}

function printTicket(tk: any) {
    var amount, data, funder, nonce, packed0, packed1, r, ratio, reveal, s;
    [data, reveal, packed0, packed1, r, s] = tk;
    amount = packed0 & uint128;
    nonce = (packed0 >> 128) & uint64;
    funder = addrtype & (packed1 >> 1);
    ratio = uint64 & (packed1 >> 161);
    console.log('Ticket data:');
    console.log(`  Data: ${data}`);
    console.log(`  Reveal: ${reveal}`);
    console.log(`  Packed0: ${packed0}`);
    console.log(`  Packed1: ${packed1}`);
    console.log(`  r: ${r}   s: ${s}`);
    console.log(`Packed data:`);
    console.log(`  Amount: ${amount}`);
    console.log(`  Nonce: ${nonce}`);
    console.log(`  Funder: ${funder}`);
    console.log(`  Ratio: ${ratio}`);

    if (isWinner(tk)) {
        console.log('\nThis ticket is a winner!');
    } else {
        console.log('\nThis ticket is a loser.');
    }
}

function claim(plyr: any, oppo: any) {
    var tk, tstr;

    if (oppo === null) {
        console.log(
            "Error! You must set up your opponent's info before you can pay them!"
        );
        return;
    }

    tstr = console.log('Enter ticket code. ');
    tk = deserializeTicket(tstr);
    printTicket(tk);

    if (isWinner(tk)) {
        claimTicket(tk, plyr);
    }
}

function printInfo(plyr: any, oppo: any) {
    console.log('Your information:');
    printPlayer(plyr);

    if (oppo !== null) {
        console.log('\nOpponent:');
        printPlayer(oppo);
    }
}
 */
