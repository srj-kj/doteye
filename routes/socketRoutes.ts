// qoutesRoute.ts
import WebSocket from 'ws';
import { average, qoutes, slippage } from '../helper/postHelper';

export const  handleQoutesWebSocket = (ws: WebSocket)=> {
  console.log('A client connected to /qoutes');

  const intervalId = setInterval(async () => {
    if (ws.readyState === WebSocket.OPEN) {
      const result = await qoutes();
      console.log(result);
      ws.send(JSON.stringify(result));
    } else {
      clearInterval(intervalId);
    }
  }, 500);

  ws.on('close', () => {
    console.log('A client disconnected from /qoutes');
    clearInterval(intervalId);
  });
}

export const handleAverageWebSocket =(ws: WebSocket)=> {
    console.log('A client connected to /average');
  
    const intervalId = setInterval(async() => {
        if (ws.readyState === WebSocket.OPEN) {
          const result = await qoutes()
          const averageData = average(result);
          ws.send(JSON.stringify(averageData));
        } else {
          clearInterval(intervalId);
        }
      }, 500);
  
    ws.on('close', () => {
      console.log('A client disconnected from /average');
      clearInterval(intervalId);
    });
  }


  export const handleSlippageWebSocket =(ws: WebSocket)=> {
    console.log('A client connected to /slippage');
  
    const intervalId = setInterval(async() => {
        if (ws.readyState === WebSocket.OPEN) {
          const result = await qoutes()
          const averageData = average(result);
          const response = slippage(result,averageData)
          ws.send(JSON.stringify(response));
        } else {
          clearInterval(intervalId);
        }
      }, 500);
  
    ws.on('close', () => {
      console.log('A client disconnected from /slippage');
      clearInterval(intervalId);
    });
  }