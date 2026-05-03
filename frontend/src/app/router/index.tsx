import { createBrowserRouter } from "react-router-dom";
import App from "../../App";
import { ProductListPage } from "../../features/products/pages/ProductListPage";
import { ProductDetailPage } from "../../features/products/pages/ProductDetailPage";
import { CartPage } from "../../features/cart/pages/CartPage";
import { SimulatorPage } from "../../features/simulator/pages/SimulatorPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: <ProductListPage />,
            },
            {
                path: "products/:productId",
                element: <ProductDetailPage />,
            },
            {
                path: "cart",
                element: <CartPage />,
            },
            {
                path: "simulator",
                element: <SimulatorPage />,
            },
        ],
    },
]);