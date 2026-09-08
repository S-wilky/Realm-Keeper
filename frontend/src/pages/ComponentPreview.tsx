import { useState } from "react";
import DropDown from "../components/DropDown";
import MultiSelect from "../components/MultiSelect";
import UnderlineInput from "../components/UnderlineInput";
import UnderlineMultiSelect from "../components/UnderlineMultiSelect";
import UnderlineDropDown from "../components/UnderlineDropDown";
import FlipChip from "../components/FlipChip";

const options = [
    { label: "Character", value: "character" },
    { label: "Location", value: "location" },
    { label: "Organization", value: "organization" },
    { label: "Item", value: "item" },
];

const underlineDropdownOptions = [
    { label: "Character", value: "character" },
    { label: "Location", value: "location" },
    { label: "Organization", value: "organization" },
    { label: "Item", value: "item" },
    { label: "Event", value: "event" },
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

    // State hooks for the new Underline & FlipChip additions
    const [titleValue, setTitleValue] = useState("");
    const [aliasesValue, setAliasesValue] = useState<string[]>(["The Compact", "Ashen Oath"]);
    const [typeValue, setTypeValue] = useState("organization");
    const [underlineErrorValue, setUnderlineErrorValue] = useState<string[]>([]);

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

                {/* --- Bekah's work is safe above, new components below --- */}
                
                <hr className="border-[#2A3A55] my-8" />

                {/* Underline Input */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        Underline — Input
                    </h2>
                    <UnderlineInput
                        label="Title"
                        value={titleValue}
                        onChange={setTitleValue}
                        placeholder="Name this Tome"
                    />
                </section>

                {/* Underline MultiSelect */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        Underline — MultiSelect (Aliases)
                    </h2>
                    <UnderlineMultiSelect
                        label="Aliases"
                        value={aliasesValue}
                        onChange={setAliasesValue}
                        placeholder="Add an alias"
                    />
                </section>

                {/* Underline DropDown */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        Underline — DropDown
                    </h2>
                    <UnderlineDropDown
                        label="Type — dropdown"
                        options={underlineDropdownOptions}
                        value={typeValue}
                        onChange={setTypeValue}
                        placeholder="Select a type"
                    />
                </section>

                {/* Underline MultiSelect - Error */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">
                        Underline — MultiSelect Error State
                    </h2>
                    <UnderlineMultiSelect
                        label="Aliases"
                        value={underlineErrorValue}
                        onChange={setUnderlineErrorValue}
                        error="Already used by another Tome in this world."
                        placeholder="Add an alias"
                    />
                </section>

                {/* FlipChip */}
                <section>
                    <h2 className="mb-4 text-lg font-semibold">FlipChip (Interactive Toggle)</h2>
                    <FlipChip
                        initialState="draft"
                        onChange={(newState) => console.log("Chip flipped to:", newState)}
                     />
                </section>
            </div>
        </div>
    );
}