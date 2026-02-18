import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Photo {
    url: string;
    height: bigint;
    width: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Restaurant {
    id: bigint;
    starRating: number;
    name: string;
    distance: number;
    priceRange: string;
    category: string;
    mainPhoto?: Photo;
    subPhotos: Array<Photo>;
}
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    clearFavorites(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFavorites(): Promise<Array<Restaurant>>;
    getRestaurants(isTest: boolean): Promise<Array<Restaurant>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveFavoriteRestaurantFromApi(restaurant: Restaurant): Promise<void>;
    swipeRight(restaurantId: bigint, isTest: boolean): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateStarRating(restaurantId: bigint, rating: number, isTest: boolean): Promise<void>;
}
