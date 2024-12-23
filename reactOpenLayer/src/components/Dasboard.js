import React from "react"
import { Box, Grid, Paper } from "@mui/material"
import { Link } from "react-router-dom"

const Dashboard = ({ children }) => {
    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            {/*  Sidebar  */}
            <Box sx={{ width: "250px", backgroundColor: "#f4f4f4", p: 2 }}>
                <h2>Dashboard</h2>
                <ul>
                    <li>
                        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link to="/accessibleMap" style={{ textDecoration: "none", color: "inherit" }}>
                        Accessible Map
                        </Link>
                    </li>
                    <li>
                        <Link to="/vectorLayerMap" style={{ textDecoration: "none", color: "inherit" }}>
                        Vector Layer Map
                        </Link>
                    </li>
                    <li>
                        <Link to="/vectorTiles" style={{ textDecoration: "none", color: "inherit" }}>
                        Vector Tiles
                        </Link>
                    </li>
                    <li>
                        <Link to="/drawShapes" style={{ textDecoration: "none", color: "inherit" }}>
                        Draw Shapes
                        </Link>
                    </li>
                    <li>
                        <Link to="/drawAndModify" style={{ textDecoration: "none", color: "inherit" }}>
                        Draw And Modify
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" style={{ textDecoration: "none", color: "inherit" }}>
                            Settings
                        </Link>
                    </li>
                </ul>
            </Box>

            {/* Main Content */}
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ p: 2 }}>
                            {children}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    )
}

export default Dashboard