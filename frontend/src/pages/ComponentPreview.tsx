import { useState } from "react";
import DropDown from "../components/DropDown";
import MultiSelect from "../components/MultiSelect";

const options = [
    { label: "Character", value: "character" },
    { label: "Location", value: "location" },
    { label: "Organization", value: "organization" },
    { label: "Item", value: "item" },
];

export default function ComponentPreview() {
    const [dropDownValue, setDropDownValue] = useState("");

    const [multiSelectValue, setMultiSelectValue] = useState<string[]>([
        "character",
        "organization",
    ]);

    const [emptyMultiSelectValue, setEmptyMultiSelectValue] = useState<
        string[]
    >([]);

    const [errorMultiSelectValue, setErrorMultiSelectValue] = useState<
        string[]
    >([]);

    return (
        <div
            className="min-h-screen p-10"
            style={{
                backgroundColor: "#0B1220",
                color: "#ECE6DA",
            }}
        >
            <h1 className="mb-10 text-2xl font-bold">
                Realm Keeper Component Preview
            </h1>

            <div className="max-w-xl space-y-12">

                {/* DropDown */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        DropDown
                    </h2>

                    <DropDown
                        options={options}
                        value={dropDownValue}
                        onChange={setDropDownValue}
                        placeholder="Select a type"
                    />
                </section>

                {/* DropDown - Disabled */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        DropDown - Disabled
                    </h2>

                    <DropDown
                        options={options}
                        value="location"
                        disabled
                        placeholder="Select a type"
                    />
                </section>

                {/* MultiSelect */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        MultiSelect
                    </h2>

                    <MultiSelect
                        value={multiSelectValue}
                        onChange={setMultiSelectValue}
                        label="Types"
                        placeholder="Add an item"
                    />
                </section>

                {/* MultiSelect - Empty */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        MultiSelect - Empty
                    </h2>

                    <MultiSelect
                        value={emptyMultiSelectValue}
                        onChange={setEmptyMultiSelectValue}
                        placeholder="Add an item"
                    />
                </section>

                {/* MultiSelect - Disabled */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        MultiSelect - Disabled
                    </h2>

                    <MultiSelect
                        value={["character", "organization"]}
                        disabled
                        placeholder="Add an item"
                    />
                </section>

                {/* MultiSelect - Error */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        MultiSelect - Error
                    </h2>

                    <MultiSelect
                        value={errorMultiSelectValue}
                        onChange={setErrorMultiSelectValue}
                        error="Please select at least one type."
                        placeholder="Add an item"
                    />
                </section>

            </div>
        </div>
    );
}
