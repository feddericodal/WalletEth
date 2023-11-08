const {loadFixture } = require ('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require ('hardhat');

describe('EtherWallet', function() {
    async function deployFixture() {
        // destructuring assignment" assegno l oggetto/array signer che ha piu valori il primo a owner e il secondo a otherAccount
        // parentesi [] per array e parentesi {} per oggetti
        //console.log(await ethers.getSigners() );
        const [owner, otherAccount] = await ethers.getSigners();


       // console.log(await ethers.getContractFactory('EtherWallet') );
        const EtherWallet = await ethers.getContractFactory('EtherWallet');
        const etherWallet = await EtherWallet.deploy();

        return { etherWallet, owner, otherAccount};
    }
    describe('deployment', function(){
        it('Should deploy and set the owner to be deployed address', async function(){

            const {etherWallet , owner } = await loadFixture(deployFixture);
            expect ( await etherWallet.owner()).to.equal( owner.address );

        })
    })

    describe('deposit', function(){
        it('should deposit Ether to the contract', async function(){
            const { etherWallet } = await loadFixture(deployFixture);

            const tx = await etherWallet.deposit({
                value: ethers.parseEther('1')
            })
            await tx.wait();
            const balance = await ethers.provider.getBalance(await etherWallet.getAddress() );
            expect(balance.toString()).to.equal(ethers.parseEther('1'));
        })

    })
    
    describe('Withdrawal', function(){
        it('should withdraw ether from the contract with zero Eth', async function(){
            const {etherWallet , owner }=  await loadFixture(deployFixture);

            const tx = await etherWallet.connect(owner).withdraw(owner.address, ethers.parseEther('0'));
            await tx.wait();

            const balance = await ethers.provider.getBalance(await etherWallet.getAddress());
            expect(balance.toString()).to.equal(ethers.parseEther('0'));

        })

        it('should withdraw ether from the contract with zero Eth', async function(){
            const {etherWallet , owner }=  await loadFixture(deployFixture);
            
            const depositTx = await etherWallet.deposit({
                value: ethers.parseEther('1')
            })
            await depositTx.wait();
            //first deposit eth to do withdraw
            let balance = await ethers.provider.getBalance(await etherWallet.getAddress() );
            expect(balance.toString()).to.equal(ethers.parseEther('1'));

            const withdrawtx = await etherWallet.connect(owner).withdraw(owner.address, ethers.parseEther('1'));
            await withdrawtx.wait();

            balance = await ethers.provider.getBalance(await etherWallet.getAddress());
            expect(balance.toString()).to.equal(ethers.parseEther('0'));

        })
        it('should give error if it called from not the owner', async function(){
            const {etherWallet , owner, otherAccount } =  await loadFixture(deployFixture);
        

           await expect(await etherWallet.connect(otherAccount).withdraw(owner.address, ethers.parseEther('0'))).to.be.revertedWith('solo il propietario puo mandare ether');

        })

    })
    describe('mybalance', function(){
        it('mybalance should be equal contract balance', async function(){
            const {etherWallet , owner }=  await loadFixture(deployFixture);
            let balance = await ethers.provider.getBalance(await etherWallet.getAddress() ); // prendo il balance dello sc
            const tx = await etherWallet.myBalance(); // prendo balance da mybalance function
            
          //  console.log("balance ", balance);
    
            expect(tx).to.equal(balance);    
        })

        it('mybalance should be 1', async function(){
            const {etherWallet , owner }=  await loadFixture(deployFixture);
            const depositTX = await etherWallet.deposit({
                value: ethers.parseEther('1')
            })
            await depositTX.wait();

            let balance = await ethers.provider.getBalance(await etherWallet.getAddress() ); // prendo il balance dello sc

            const tx = await etherWallet.myBalance(); // prendo il balance dalla funzione mybalance


            console.log("tx: ", tx , "balance: ", balance);
            expect(tx).to.equal(balance);    // confronto il balance dello sc al balance della funzione
        })                
     })

})