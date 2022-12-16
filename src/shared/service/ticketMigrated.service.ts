const Web3 = require('web3');
const ethAbi = require('eth-abi');
const ethAccount = require('eth-account');
const w3 = new Web3(
    new Web3.providers.HttpProvider('https://rpc.gnosischain.com/')
);

const datetime = require('datetime');
const struct = require('struct');
const json = require('json');
const itertools = require('itertools');
const math = require('math');

const uint64 = 2 ** 64 - 1; // 18446744073709551615
const uint128 = 2 ** 128 - 1; // 340282366920938463463374607431768211455
const addrtype = 2 ** (20 * 8) - 1;

const lotaddr = '0x6dB8381b2B41b74E17F5D4eB82E8d5b04ddA0a82';

let lotabi = JSON.parse(
    '[ { "inputs": [ { "internalType": "uint64", "name": "day", "type": "uint64" } ], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "contract IERC20", "name": "token", "type": "address" }, { "indexed": true, "internalType": "address", "name": "funder", "type": "address" }, { "indexed": true, "internalType": "address", "name": "signer", "type": "address" } ], "name": "Create", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "unlock_warned", "type": "uint256" } ], "name": "Delete", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "address", "name": "funder", "type": "address" }, { "indexed": true, "internalType": "address", "name": "recipient", "type": "address" } ], "name": "Enroll", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "internalType": "bytes32", "name": "key", "type": "bytes32" }, { "indexed": false, "internalType": "uint256", "name": "escrow_amount", "type": "uint256" } ], "name": "Update", "type": "event" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "components": [ { "internalType": "bytes32", "name": "data", "type": "bytes32" }, { "internalType": "bytes32", "name": "reveal", "type": "bytes32" }, { "internalType": "uint256", "name": "packed0", "type": "uint256" }, { "internalType": "uint256", "name": "packed1", "type": "uint256" }, { "internalType": "bytes32", "name": "r", "type": "bytes32" }, { "internalType": "bytes32", "name": "s", "type": "bytes32" } ], "internalType": "struct OrchidLottery1.Ticket[]", "name": "tickets", "type": "tuple[]" }, { "internalType": "bytes32[]", "name": "refunds", "type": "bytes32[]" } ], "name": "claim", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "int256", "name": "adjust", "type": "int256" }, { "internalType": "int256", "name": "warn", "type": "int256" }, { "internalType": "uint256", "name": "retrieve", "type": "uint256" } ], "name": "edit", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "int256", "name": "adjust", "type": "int256" }, { "internalType": "int256", "name": "warn", "type": "int256" }, { "internalType": "uint256", "name": "retrieve", "type": "uint256" } ], "name": "edit", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "bool", "name": "cancel", "type": "bool" }, { "internalType": "address[]", "name": "recipients", "type": "address[]" } ], "name": "enroll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "funder", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" } ], "name": "enrolled", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "signer", "type": "address" }, { "internalType": "uint64", "name": "marked", "type": "uint64" } ], "name": "mark", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "onTokenTransfer", "outputs": [ { "internalType": "bool", "name": "", "type": "bool" } ], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "contract IERC20", "name": "token", "type": "address" }, { "internalType": "address", "name": "funder", "type": "address" }, { "internalType": "address", "name": "signer", "type": "address" } ], "name": "read", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "stateMutability": "view", "type": "function" }, { "inputs": [ { "internalType": "uint256", "name": "count", "type": "uint256" }, { "internalType": "bytes32", "name": "seed", "type": "bytes32" } ], "name": "save", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" } ], "name": "tokenFallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]'
);

const lottery = new web3.eth.Contract(lotaddr, abi);
const token = '0x' + '0'.repeat(40);
const to_32byte_hex = (val) => {
    return Web3.toHex(Web3.toBytes(val).padStart(32, '0'));
};

const ticket = (amount, reveal, ratio, funder, recipient, key) => {
    const data = '0'.repeat(32);
    const issued = Math.floor(new Date().getTime() / 1000);
    const l2nonce =
        parseInt(Web3.keccak(new Date().toString()).slice(2), 16) &
        (2 ** 64 - 1);
    const expire = 2 ** 31 - 1;
    const packed0 = (issued << 192) | (l2nonce << 128) | amount;
    let packed1 =
        (expire << 224) | (ratio << 160) | parseInt(funder.slice(2), 16);
    const digest = Web3.solidityKeccak(
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
            '0x19',
            '0x00',
            lotaddr,
            '0'.repeat(31) + '0x64',
            token,
            recipient,
            Web3.solidityKeccak(['bytes32'], [reveal]),
            packed0,
            packed1,
            data,
        ]
    );
    const sig = w3.eth.accounts.sign(digest, key);

    packed1 = (packed1 << 1) | ((sig.v - 27) & 1);
    const tk = [
        data,
        parseInt(reveal.slice(2), 16).toString(2).padStart(32, '0'),
        packed0,
        packed1,
        to_32byte_hex(sig.r),
        to_32byte_hex(sig.s),
    ];
    return tk;
};

const claimTicket = (tkt, plyr) => {
    const l1nonce = w3.eth.getTransactionCount(plyr.account);
    const func = lottery.methods.claim(token, plyr.account, [tkt], []);
    const tx = func.encodeABI();
    const signed = w3.eth.accounts.signTransaction(tx, plyr.key);
    const txhash = w3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log('Claim transaction hash: ', txhash.slice(2));
};

const serializeTicket = (tk) => {
    return (
        tk[0] +
        tk[1] +
        to_32byte_hex(tk[2]).slice(2) +
        to_32byte_hex(tk[3]).slice(2) +
        tk[4].slice(2) +
        tk[5].slice(2)
    );
    return JSON.stringify([tk[0], tk[1], tk[2], tk[3], tk[4], tk[5]]);
};

const deserializeTicket = (tstr) => {
    const tk = [];
    for (let i = 0; i < tstr.length; i += 64) {
        tk.push(tstr.substr(i, 64));
    }
    tk[2] = parseInt(tk[2], 16);
    tk[3] = parseInt(tk[3], 16);
    return tk;
};

const setupPlayerTickets = (plyr) => {
    const amount_ = prompt('What size face value do you want to use? ');
    plyr.amount = Math.floor(parseFloat(amount_) * 10 ** 18);
    const prob = prompt(
        'What win probability do you want to use (value between 0 and 1)? '
    );
    plyr.ratio = Math.floor(uint64 * parseFloat(prob));
    return plyr;
};

const newReveal = (username) => {
    const str = username;
    const hash = Web3.keccak(str).slice(2);
    return { str, hash };
};

function printPlayer(plyr) {
    const account = plyr['account'];
    console.log('Player: ', plyr['name']);
    if ('key' in plyr) {
        console.log('  Key: ', plyr['key'].hex());
    }
    if ('reveal' in plyr) {
        console.log('  Reveal: ', plyr['reveal']['hash']);
    }
    console.log('  L1/L2 Address: ', account);
    if ('amount' in plyr) {
        console.log(
            '  Ticket facevalues: ',
            (plyr['amount'] / Math.pow(10, 18)).toFixed(4)
        );
        console.log(
            '  Ticket win ratio: ',
            (plyr['ratio'] / uint64).toFixed(2)
        );
    }

    const balance = checkBalance(account)[0];
    const escrow = checkBalance(account)[1];
    console.log('  Balance: ', balance);
    console.log('  Escrow: ', escrow);
    console.log('  Player code: ', plyr['share']);
}

function checkBalance(address) {
    const escrowAmount = lottery.functions
        .read(token, address, address)
        .call((block_identifier = 'latest'))[0];
    const balance = (escrowAmount & uint128) / Math.pow(10, 18);
    const escrow = (escrowAmount >> 128) / Math.pow(10, 18);
    return [balance, escrow];
}

function serializePlayer(plyr) {
    return plyr['account'] + plyr['reveal']['hash'];
}

function printHelp() {
    console.log('Commands are help, opponent, pay, claim, info');
}

function enterOppo() {
    const opstr = prompt("Enter opponent's player code. ");
    const out = {};
    out['name'] = 'opponent';
    out['account'] = opstr?.slice(0, 42);
    out['reveal'] = {};
    out['reveal']['hash'] = opstr?.slice(42);
    out['share'] = opstr;
    return out;
}

function generateTicket(plyr, oppo) {
    if (oppo === null) {
        console.log(
            "Error! You must set up your opponent's info before you can pay them!"
        );
        return;
    }
    const tk = ticket(
        plyr['amount'],
        plyr['reveal']['hash'],
        plyr['ratio'],
        plyr['account'],
        oppo['account'],
        plyr['key']
    );
}

const isWinner = (tk) => {
    const [data, reveal, packed0, packed1, r, s] = tk;
    const nonce = (packed0 >> 128) & uint64;
    const ratio = uint64 & (packed1 >> 161);

    const hash = web3.Web3.solidityKeccak(
        ['uint256', 'uint128'],
        [parseInt(reveal, 16), nonce]
    );
    const comp = uint64 & parseInt(hash.hex(), 16);
    if (ratio < comp) {
        return false;
    }
    return true;
};

const printTicket = (tk) => {
    const [data, reveal, packed0, packed1, r, s] = tk;
    const amount = packed0 & uint128;
    const nonce = (packed0 >> 128) & uint64;
    const funder = addrtype & (packed1 >> 1);
    const ratio = uint64 & (packed1 >> 161);

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
};

const claim = (plyr, oppo) => {
    if (oppo === null) {
        console.log(
            "Error! You must set up your opponent's info before you can pay them!"
        );
        return;
    }
    const tstr = prompt('Enter ticket code. ');
    const tk = deserializeTicket(tstr);
    printTicket(tk);
    if (isWinner(tk)) {
        claimTicket(tk, plyr);
    }
};

const printInfo = (plyr, oppo) => {
    console.log('Your information:');
    console.log(printPlayer(plyr));
    if (oppo !== null) {
        console.log('\nOpponent:');
        console.log(printPlayer(oppo));
    }
};
