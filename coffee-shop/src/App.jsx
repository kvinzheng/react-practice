import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import "./App.css";

const MENU = {
  Espresso: 2000,
  Latte: 4000,
  Cappuccino: 3500,
  Americano: 2500,
  Mocha: 5000,
  Matcha: 3000,
};

export default function App() {
  const [orders, setOrders] = useState([]);
  const [counterOffers, setCounterOffers] = useState([]);
  const menuEntries = useMemo(() => Object.entries(MENU), []);

  const submitOrder = (name, time) => {
    setOrders((prev) => {
      const clone = prev.map((ele) => ({ ...ele }));
      clone.push({ name: name, time });
      return clone;
    });
  };

  return (
    <div className="app">
      <header>
        <h1>☕ Virtual Coffee Shop</h1>
        <p className="sub">1 barista · 1 drink at a time</p>
      </header>

      <main>
        <section className="panel">
          <h2>Menu</h2>
          <ul className="menu">
            {menuEntries.map(([name, time]) => (
              <li key={name}>
                <button onClick={() => submitOrder(name, time)}>
                  <span className="name">{name}</span>
                  <span className="time">{time / 1000}s</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <OrderComponent
          setOrders={setOrders}
          orders={orders}
          setCounterOffers={setCounterOffers}
        />
        <CounterComponent
          setCounterOffers={setCounterOffers}
          counterOffers={counterOffers}
        />
      </main>
    </div>
  );
}

function OrderComponent({ orders, setOrders, setSendOut, setCounterOffers }) {
  const timer = useRef(null);

  useEffect(() => {
    if (orders.length && !timer.current) {
      const { time, name } = orders[0];

      timer.current = setTimeout(() => {
        timer.current = null;
        clearTimeout(timer.current)
        setOrders((prev) => {
          const clone = prev.map((ele) => ({ ...ele }));
          clone.shift();
          return clone;
        });
        setCounterOffers((prev) => {
          const clone = prev.map((ele) => ({ ...ele }));
          clone.push({ time, name });
          return clone;
        });
      }, time);
    }
  }, [orders]);

  return (
    <div>
      order
      {orders.map((ele, i) => (
        <div key={i}>name:{ele.name}</div>
      ))}
    </div>
  );
}

function CounterComponent({
  counterOffers,
  setCounterOffers,
  setSendOut,
  sendOut,
}) {
  const timer = useRef(null);

  useEffect(() => {
    if (counterOffers.length) {
      const last = counterOffers[counterOffers.length - 1];
      setTimeout(() => {
        setCounterOffers((prev) => prev.filter((ele) => ele !== last));
      }, 3000);
    }
  }, [counterOffers]);

  return (
    <div>
      counter
      {counterOffers.map((ele) => {
        return <div>name:{ele.name}</div>;
      })}
    </div>
  );
}
