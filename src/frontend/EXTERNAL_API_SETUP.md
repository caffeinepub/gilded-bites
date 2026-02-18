# External API Setup Guide

This document explains how to configure Gilded Bites to use an external restaurant data API instead of mock data.

## Configuration Overview

Gilded Bites supports two data source modes:
- **Mock mode** (default): Uses built-in sample restaurant data
- **External mode**: Fetches real restaurant data from an external API

## Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

