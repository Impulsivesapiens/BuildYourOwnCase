"use client";
import React, { useState, useEffect, createRef } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';


export default function Manage() {

    interface Color {
        id: string,
        label: string,
        value: string,
        tw: string,

    }
    interface Material {
        id: string,
        label: string,
        value: string,
        description?: string,
        price: number,
    }
    interface Finish {
        id: string,
        label: string,
        value: string,
        description?: string,
        price: number,
    }
    interface Device {
        id: string,
        label: string,
        value: string,
    }
    const [loading, setLoading] = useState(true);
    const [colors, setColors] = useState<Color[]>([]);
    const [materials, setMaterials] = useState<Material[]>([]);
    const [finishes, setFinishes] = useState<Finish[]>([]);
    const [devices, setDevices] = useState<Device[]>([]);
    const [visible, setVisible] = useState("");

    const deviceNameRef = createRef<HTMLInputElement>();
    const deviceValueRef = createRef<HTMLInputElement>();
    const colorNameRef = createRef<HTMLInputElement>();
    const colorValueRef = createRef<HTMLInputElement>();
    const tailwindColorRef = createRef<HTMLInputElement>();
    const materialNameRef = createRef<HTMLInputElement>();
    const materialValueRef = createRef<HTMLInputElement>();
    const materialDescriptionRef = createRef<HTMLInputElement>();
    const materialPriceRef = createRef<HTMLInputElement>();
    const finishNameRef = createRef<HTMLInputElement>();
    const finishValueRef = createRef<HTMLInputElement>();
    const finishDescriptionRef = createRef<HTMLInputElement>();
    const finishPriceRef = createRef<HTMLInputElement>();

    const fetchData = async () => {
        try {
            const res = await fetch("/api/configure");
            const { colors, finishes, materials, devices } = await res.json();

            if (!colors || !finishes || !materials || !devices) {
                throw new Error("Data not found");
            }

            setColors(colors);
            setMaterials(materials);
            setFinishes(finishes);
            setDevices(devices);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching configuration data:", error);
        }
    };
    useEffect(() => {

        fetchData();
    }, []);

    const handleSubmit = () => {
        // Initialize data object
        let data: { visible: string; devices?: { label: string; value: string; }[]; colors?: { label: string; value: string; tailwindColor: string; }[]; materials?: { label: string; value: string; description: string; price: string; }[]; finishes?: { label: string; value: string; description: string; price: string; }[]; } = { visible };

        // Check `visible` value and assign corresponding data
        if (visible === "devices") {
            data.devices = [{
                label: deviceNameRef.current?.value || "",
                value: deviceValueRef.current?.value || "",
            }];
        } else if (visible === "colors") {
            console.log(colorNameRef.current?.value);
            data.colors = [{
                label: colorNameRef.current?.value || "",
                value: colorValueRef.current?.value || "",
                tailwindColor: tailwindColorRef.current?.value || "",
            }];
        } else if (visible === "materials") {
            data.materials = [{
                label: materialNameRef.current?.value || "",
                value: materialValueRef.current?.value || "",
                description: materialDescriptionRef.current?.value || "",
                price: materialPriceRef.current?.value || "",
            }];
        } else if (visible === "finishes") {
            data.finishes = [{
                label: finishNameRef.current?.value || "",
                value: finishValueRef.current?.value || "",
                description: finishDescriptionRef.current?.value || "",
                price: finishPriceRef.current?.value || "",
            }];
        }

        // Send data to the server
        fetch("/api/configure", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                setVisible("");
                fetchData()
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
            });
    };


    const deleteStuff = (visible: string, id: string) => {
        const ids = [id];
        let data = { visible, ids };
        fetch("/api/delete", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log(responseData);
                setVisible("");
                fetchData()
            })
            .catch((error) => {
                console.error("Error submitting data:", error);
            });
    }
    if (loading) {
        return <div className='min-h-[90vh] flex item-center content-center justify-center mt-[40vh]'><Loader2 className='h-14 w-14 animate-spin text-zinc-500' /></div>;
    }



    return (
        <div className="flex flex-col min-h-screen w-full bg-muted/40 items-center m-5">
            <div className="w-3/4 flex flex-col gap-6">
                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-4xl font-bold tracking-tight self-start m-2">Available Devices</h1>
                        <Button className="m-2" onClick={() => {
                            setVisible("devices");
                            if (visible === "devices") {
                                setVisible("");

                            }
                        }}>Add Device</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead className="hidden sm:table-cell">Value</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map((order) => (
                                <TableRow key={order.id.toString()} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">{order.label}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.value}</div>
                                    </TableCell>
                                    <Button className="bg-red-400 p-3 rounded-full " onClick={() => { deleteStuff("devices", order.id) }}>X</Button>
                                </TableRow>
                            ))}
                            {visible === "devices" && (

                                <TableRow className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">
                                            <input type="text" placeholder="Device Name" name="device_name" className="border-2 border-gray-300 p-2 rounded-md" ref={deviceNameRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Device Value" name="device_value" className="border-2 border-gray-300 p-2 rounded-md" ref={deviceValueRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSubmit}>Submit</Button>
                                    </TableCell>
                                </TableRow>

                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-4xl font-bold tracking-tight self-start m-2">Available Colors</h1>
                        <Button className="m-2" onClick={() => {
                            setVisible("colors");
                            if (visible === "colors") {
                                setVisible("");
                            }
                        }}>Add Color</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead className="hidden sm:table-cell">Value</TableHead>
                                <TableHead className="hidden sm:table-cell">Tailwind Color</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {colors.map((order) => (
                                <TableRow key={order.id.toString()} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">{order.label}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.value}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.tw}</div>
                                    </TableCell>
                                    <Button className="bg-red-400 p-3 rounded-full " onClick={() => { deleteStuff("colors", order.id) }}>X</Button>

                                </TableRow>
                            ))}
                            {visible === "colors" && (

                                <TableRow className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">
                                            <input type="text" placeholder="Color Name" name="color_name" className="border-2 border-gray-300 p-2 rounded-md" ref={colorNameRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Color Value" name="color_value" className="border-2 border-gray-300 p-2 rounded-md" ref={colorValueRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Tailwind Color" name="tailwind_color" className="border-2 border-gray-300 p-2 rounded-md" ref={tailwindColorRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSubmit}>Submit</Button>
                                    </TableCell>
                                </TableRow>

                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-4xl font-bold tracking-tight self-start m-2">Available Materials</h1>
                        <Button className="m-2" onClick={() => {
                            setVisible("materials");
                            if (visible === "materials") {
                                setVisible("");
                            }
                        }}>Add Materials</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead className="hidden sm:table-cell">Value</TableHead>
                                <TableHead className="hidden sm:table-cell">Description</TableHead>
                                <TableHead className="hidden sm:table-cell">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {materials.map((order) => (
                                <TableRow key={order.id} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">{order.label}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.value}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.description}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{formatPrice(order.price)}</div>
                                    </TableCell>
                                    <Button className="bg-red-400 p-3 rounded-full " onClick={() => { deleteStuff("materials", order.id) }}>X</Button>

                                </TableRow>
                            ))}
                            {visible === "materials" && (

                                <TableRow className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">
                                            <input type="text" placeholder="Material Name" name="material_name" className="border-2 border-gray-300 p-2 rounded-md" ref={materialNameRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Material Value" name="material_value" className="border-2 border-gray-300 p-2 rounded-md" ref={materialValueRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Material Description" name="material_description" className="border-2 border-gray-300 p-2 rounded-md" ref={materialDescriptionRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Material Price" name="material_price" className="border-2 border-gray-300 p-2 rounded-md" ref={materialPriceRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSubmit}>Submit</Button>
                                    </TableCell>
                                </TableRow>

                            )}
                        </TableBody>
                    </Table>
                </div>

                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="text-4xl font-bold tracking-tight self-start m-2">Available Finishes</h1>
                        <Button className="m-2" onClick={() => {
                            setVisible("finishes");
                            if (visible === "finishes") {
                                setVisible("");
                            }
                        }}>Add Finishes</Button>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Label</TableHead>
                                <TableHead className="hidden sm:table-cell">Value</TableHead>
                                <TableHead className="hidden sm:table-cell">Description</TableHead>
                                <TableHead className="hidden sm:table-cell">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {finishes.map((order) => (
                                <TableRow key={order.id.toString()} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">{order.label}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.value}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{order.description}</div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">{formatPrice(order.price)}</div>
                                    </TableCell>
                                    <Button className="bg-red-400 p-3 rounded-full " onClick={() => { deleteStuff("finishes", order.id) }}>X</Button>

                                </TableRow>
                            ))}
                            {visible === "finishes" && (

                                <TableRow className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">
                                            <input type="text" placeholder="Finish Name" name="finish_name" className="border-2 border-gray-300 p-2 rounded-md" ref={finishNameRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Finish Value" name="finish_value" className="border-2 border-gray-300 p-2 rounded-md" ref={finishValueRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Finish Description" name="finish_description" className="border-2 border-gray-300 p-2 rounded-md" ref={finishDescriptionRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            <input type="text" placeholder="Finish Price" name="finish_price" className="border-2 border-gray-300 p-2 rounded-md" ref={finishPriceRef} />
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={handleSubmit}>Submit</Button>
                                    </TableCell>
                                </TableRow>

                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
