import React, { useState } from "react";
import axios from "axios";

const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; // "B" nin başlangıç indeksi

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [bPosition, setBPosition] = useState(initialIndex);

  function getXY(index) {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMesaj() {
    const { x, y } = getXY(bPosition);
    return `Koordinatlar (${x}, ${y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setBPosition(initialIndex);
  }

  function sonrakiIndex(yon, index) {
    const x = index % 3;
    const y = Math.floor(index / 3);

    switch (yon) {
      case "sol":
        if (x > 0) return index - 1;
        else if (x === 0) {
          setMessage(`Sola gidemezsiniz`);
        }
        break;
      case "yukarı":
        if (y > 0) return index - 3;
        else if (y === 0) {
          setMessage(`Yukarıya gidemezsiniz`);
        }
        break;
      case "sağ":
        if (x < 2) return index + 1;
        else if (x === 2) {
          setMessage(`Sağa gidemezsiniz`);
        }
        break;
      case "aşağı":
        if (y < 2) return index + 3;
        else if (x === 2) {
          setMessage(`Aşağıya gidemezsiniz`);
        }
        break;
      default:
        break;
    }
    return index;
  }

  function ilerle(yon) {
    const yeniIndex = sonrakiIndex(yon, bPosition);

    if (yeniIndex !== bPosition) {
      setBPosition(yeniIndex); // B harfinin pozisyonunu güncelle
      setSteps(steps + 1);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();
    const payload = {
      x: getXY(bPosition).x, // B harfinin x koordinatı
      y: getXY(bPosition).y, // B harfinin y koordinatı
      steps: steps,
      email: email,
    };
    setEmail(initialEmail);
    axios
      .post("http://localhost:9000/api/result", payload)
      .then((response) => {
        // İşlemin sonuçlarıyla burada bir şeyler yapabilirsiniz
        console.log("Başarılı cevap:", response.data);
        setMessage(response.data.message);
      })
      .catch((error) => {
        // Hata durumunda burada bir şeyler yapabilirsiniz
        console.error("Hata:", error);
        setMessage(error.response.data.message);
      });
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className={`square${idx === bPosition ? " active" : ""}`}
          >
            {idx === bPosition ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => ilerle("sol")}>
          SOL
        </button>
        <button id="up" onClick={() => ilerle("yukarı")}>
          YUKARI
        </button>
        <button id="right" onClick={() => ilerle("sağ")}>
          SAĞ
        </button>
        <button id="down" onClick={() => ilerle("aşağı")}>
          AŞAĞI
        </button>
        <button id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          id="email"
          value={email}
          type="email"
          placeholder="email girin"
        ></input>
        <input id="submit" type="submit" value="Gönder"></input>
      </form>
    </div>
  );
}
