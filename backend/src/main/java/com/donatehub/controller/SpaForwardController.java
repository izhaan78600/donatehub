package com.donatehub.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    /**
     * Forwards non-API client routes to index.html so React Router can handle routing.
     */
    @GetMapping(value = {
            "/",
            "/about",
            "/drives",
            "/login",
            "/signup",
            "/admin/login",
            "/user/**",
            "/admin/**"
    })
    public String forwardSpaRoutes() {
        return "forward:/index.html";
    }
}
