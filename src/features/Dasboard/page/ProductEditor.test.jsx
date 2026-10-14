import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
    navigate: vi.fn(),
    params: {},
    listResource: vi.fn(),
    getResource: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useNavigate: () => mocks.navigate,
    useParams: () => mocks.params,
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));
vi.mock("../services/adminApi", () => ({
    createResource: vi.fn(),
    flattenApiErrors: vi.fn(() => ({})),
    getErrorMessage: vi.fn(() => "Request failed"),
    getResource: (...args) => mocks.getResource(...args),
    listResource: (...args) => mocks.listResource(...args),
    updateResource: vi.fn(),
}));

import ProductEditor from "./ProductEditor";

beforeEach(() => {
    mocks.params = {};
    mocks.navigate.mockReset();
    mocks.listResource.mockResolvedValue({ data: { results: [] } });
    mocks.getResource.mockResolvedValue({ data: {} });
});

afterEach(cleanup);

describe("product editor", () => {
    it("shows only the requested product-entry fields", () => {
        render(<ProductEditor />);

        expect(screen.getByRole("textbox", { name: "Vehicle" })).toBeVisible();
        expect(screen.getByRole("spinbutton", { name: "Manufacturing years" })).toBeVisible();
        expect(screen.getByRole("textbox", { name: "Product *" })).toBeVisible();
        expect(screen.getByRole("spinbutton", { name: "Stock" })).toBeVisible();
        expect(screen.getByRole("spinbutton", { name: "Price" })).toBeVisible();
        expect(screen.getByLabelText("Vehicle Brand")).toBeVisible();
        expect(screen.getByText("Product Images")).toBeVisible();

        expect(screen.queryByText("Description")).not.toBeInTheDocument();
        expect(screen.queryByText("Offer Details")).not.toBeInTheDocument();
        expect(screen.queryByText("Sales & Delivery")).not.toBeInTheDocument();
        expect(screen.queryByText("Product Variants & Images")).not.toBeInTheDocument();
    });

    it("loads dashboard brands into the vehicle brand selector", async () => {
        mocks.listResource.mockResolvedValue({ data: { results: [{ id: 9, name: "Toyota" }] } });

        render(<ProductEditor />);

        expect(await screen.findByRole("option", { name: "Toyota" })).toHaveValue("9");
        expect(mocks.listResource).toHaveBeenCalledWith("brands", { page_size: 500 });
    });
});
