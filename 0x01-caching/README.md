# Caching System - Key Concepts

## What is a Caching System?
A caching system stores frequently accessed data temporarily to speed up retrieval. It helps reduce latency, improve performance, and lower the load on primary data sources.

## Key Caching Strategies

- **FIFO (First In, First Out):** Removes the oldest data first when the cache is full.
- **LIFO (Last In, First Out):** Removes the most recently added data first.
- **LRU (Least Recently Used):** Evicts the least recently accessed data.
- **MRU (Most Recently Used):** Evicts the most recently accessed data.
- **LFU (Least Frequently Used):** Removes the data accessed the least often.

## Purpose of a Caching System
Caching speeds up data access, reduces latency, and improves application performance by keeping frequently requested data close at hand.

## Limitations of Caching Systems
- **Cache Invalidation:** Risk of outdated data if the cache isn't properly managed.
- **Storage Limits:** Limited cache size may lead to the eviction of useful data.
- **Complexity:** Implementing and managing a cache can be complex.
- **Consistency Issues:** Ensuring data consistency between cache and source can be challenging.
- **Overhead:** Caching uses additional memory and processing resources. 

