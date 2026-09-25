import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="page-container">

            <div className="card">
                <h1>Canteen Pre-Order System</h1>

                <p style={{ margin: "15px 0" }}>
                    Order your food in advance and avoid
                    waiting in long queues.
                </p>

                <Link to="/menu">
                    <button className="primary-button">
                        View Menu
                    </button>
                </Link>
            </div>

        </div>
    );
}

export default Home;