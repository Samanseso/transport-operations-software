import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "lrm-graphhopper";
import { useMap } from "react-leaflet";
import { useEffect } from "react";

const API_KEY = "0ff16599-5a92-4b5a-8bed-d051d277d043";

const createRoutineMachineLayer = (props: any) => {
    const map = useMap();

    useEffect(() => {
        map.zoomControl.setPosition("topright");
    }, []);

    const instance = L.Routing.control({
        lineOptions: {
            styles: [{ color: "#5ba3f1ff", weight: 5 }],
            extendToWaypoints: false,
            missingRouteTolerance: 0,
        },
        router: (L.Routing as any).graphHopper(API_KEY, {
            serviceUrl: "https://graphhopper.com/api/1/route",
            urlParameters: { vehicle: "car" },
        }),

        ...props,
        routeWhileDragging: true,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: false,

    });

    instance.on("routesfound", (e: any) => {

        const routes = e.routes;
        console.log("Routes:", routes);
        console.log("Summary:", routes[0].summary);
        console.log("Instructions:", routes[0].instructions);

        const coords = routes[0].coordinates;
        const bounds = L.latLngBounds(coords)
        
        console.log(bounds);

        if (props.setBounds) {
            props.setBounds(map, bounds);
        }

        const container = document.querySelector(".leaflet-routing-container");
        if (container) container.remove();
    });

    return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);
export default RoutingMachine;
