import { ConnectButton } from '@rainbow-me/rainbowkit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useState , useEffect, useRef} from 'react';
import EtherWallet from "./contractABI/EtherWallet.json";
import { getContractAddress } from 'viem';
import { useContractRead } from 'wagmi';
import { useWalletClient } from 'wagmi' // vecchio useSIgner
import { useContractWrite, usePrepareContractWrite } from 'wagmi' // prova per mandare una transazione allo smartCOntract
const { ethers, formatEther } = require("ethers");





const App = () => {

  const scaddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // SC address ottenuto dal deploy
 
  //etherWallet Smart contract handling
  const [scBalance, setscBalance] = useState(0);
  // per deposit
  const[ethToUseForDeposit, setEthToUseForDeposit] = useState('0');
  // ausiliare per evitare errori di inserimento
  const[spotEthToUseForDeposit, setSpotEthToUseForDeposit] = useState('0');
  //per withdraw
  const [withdrawBalance, setBalanceWithdraw] = useState('0');
  const [addressWithdraw, setAddressWithdraw] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
  // ausiliare per evitare errori di inserimento
  const [spotWithdrawBalance, setSpotBalanceWithdraw] = useState('0');
  const [spotAddressWithdraw, setSpotAddressWithdraw] = useState('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');
 


  const  contractBalance = useContractRead({
    address: scaddress,
    abi: EtherWallet.abi,
    functionName: 'myBalance',
    watch: true ,
    onSuccess(data) {
      console.log(data);
    },
    onError(error) {
      console.log(error);
    }
  });


  useEffect(() =>{
  if(contractBalance.data){
    let temp =  Number(contractBalance.data)/ 10 ** 18;
    setscBalance(temp);
  }
 },[contractBalance.data])



 const { data: walletClient } = useWalletClient(); // useSIgner

 const { config: myConfig1 } = usePrepareContractWrite({
                              address: scaddress,
                              abi: EtherWallet.abi, 
                              functionName: 'deposit',
                              account: walletClient?.account,
                              value: ethers.parseEther(ethToUseForDeposit),
                              onError(error) {
                                console.log('Error', error)
                              }
                              
  });

 const { config: myConfig2 } = usePrepareContractWrite({
                                address: scaddress,
                                abi: EtherWallet.abi,
                                functionName: 'withdraw',
                                args: [addressWithdraw,ethers.parseEther(withdrawBalance)],
                              });
 
 // Hook contract functions
 const { data: data1, write: setDeposit } = useContractWrite(myConfig1);

 const { data: data2, write: withdraw } = useContractWrite(myConfig2)



 useEffect(() =>{ // per evitare che quando cancello e la casella rimane vuota mi dia errore
  if(Number(spotEthToUseForDeposit) > 0){
    setEthToUseForDeposit(spotEthToUseForDeposit);
  }
 },[spotEthToUseForDeposit])


 useEffect(() =>{ // per evitare che quando cancello e la casella rimane vuota mi dia errore
  if(Number(spotWithdrawBalance) > 0){
    setBalanceWithdraw(spotWithdrawBalance);
  }
 },[spotWithdrawBalance])


 useEffect(() =>{ // per evitare che quando cancello e la casella rimane vuota mi dia errore
  if(Number(spotAddressWithdraw) > 0){
    setAddressWithdraw(spotAddressWithdraw);
  }
 },[spotAddressWithdraw])
 
 




  
  


  

/*
const  write  = useContractWrite({
  address: scaddress,
  abi: EtherWallet.abi,
  functionName: '',
  account: walletClient?.account,
  onError(error) {
    console.log('Error', error)
  },
})

*/

  


  

  return (
    <>
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 12,
      }}
    >
      <ConnectButton />
    </div>
     <div className="container flex flex-col items-center mt-10">

     <div className="flex mb-6">        
     </div>
     <br></br>
     <br></br>
      <h3 className = "text=5x1 font-bold mb-20">
       {"deposit to etherWallet smart Contract"}
      </h3>
          
             <Form>
                 <Form.Group className ="mb-3" controlId ="numberInEth">
                   <Form.Control
                     type="text"
                     placeholder="enter the amount in eth"
                    onChange={(e) => setSpotEthToUseForDeposit(e.target.value)}
                     />
                   <Button variant = "primary" onClick={() => 

                        setDeposit?.()

                      }

                   >
                     deposit to etherwallet smart Contract
                   </Button>
                 </Form.Group>
             </Form>
             <br></br>
             <div>EtherWallet Smart Contract Address:{scaddress}</div>
             <br></br>
             <div>EtherWallet Smart Contract balance:{scBalance}</div>
             
   </div>
   <div className="container flex flex-col items-center mt-10">

     <div className="flex mb-6">        
     </div>
      <h3 className = "text=5x1 font-bold mb-20">
       {"withdraw to etherWallet smart Contract"}
      </h3>
          
             <Form>
                 <Form.Group className ="mb-3" controlId ="numberInEth">
                   <Form.Control
                       type="text"
                       placeholder="enter the amount in eth"
                       onChange={(e) => setSpotBalanceWithdraw(e.target.value)}
                    /> <br></br>
                    <Form.Control
                        type="text"
                        placeholder="address to do withdraw"
                        onChange={(e) => setSpotAddressWithdraw(e.target.value)}
                    />
                   <Button variant = "primary" onClick={() => withdraw?.() }
                   >
                     withdraw to etherwallet smart Contract
                   </Button>
                 </Form.Group>
             </Form>
             
   </div>
   </>
  );
};

export default App;
