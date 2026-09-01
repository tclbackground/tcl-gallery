"use client";

import Link from "next/link";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  useSession,
  signOut,
} from "next-auth/react";

import {
  FiShield,
  FiLogOut,
  FiUser,
  FiHeart,
  FiShoppingCart,
  FiPackage,
  FiChevronDown,
  FiMapPin,
  FiCreditCard,
  FiPhone,
  FiMail,
} from "react-icons/fi";

export default function TopBar() {
  const {
    data: session,
    status,
  } = useSession();

  const [openAccount, setOpenAccount] =
    useState(false);

  const [wishlistCount, setWishlistCount] =
    useState(0);

  const [cartCount, setCartCount] =
    useState(0);

  const [loadingCounts, setLoadingCounts] =
    useState(false);

  const dropdownRef =
    useRef<HTMLDivElement>(null);

  // ============================================================
  // USER NAME
  // ============================================================

  const userName =
    session?.user?.name
      ? session.user.name
          .split(" ")[0]
          .toUpperCase()
      : session?.user?.email
        ? session.user.email
            .split("@")[0]
            .toUpperCase()
        : "USER";

  // ============================================================
  // ADMIN CHECK
  // ============================================================

  const isAdmin =
    (session?.user as any)?.role ===
    "ADMIN";

  // ============================================================
  // CLOSE ACCOUNT DROPDOWN
  // ============================================================

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpenAccount(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ============================================================
  // LOAD WISHLIST + CART COUNTS
  // ============================================================

  const loadCounts =
    useCallback(async () => {
      if (status !== "authenticated") {
        setWishlistCount(0);
        setCartCount(0);
        return;
      }

      try {
        setLoadingCounts(true);

        const response =
          await fetch(
            "/api/header-counts",
            {
              method: "GET",
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            "Failed to load header counts"
          );
        }

        const data =
          await response.json();

        setWishlistCount(
          Number(
            data.wishlistCount || 0
          )
        );

        setCartCount(
          Number(
            data.cartCount || 0
          )
        );
      } catch (error) {
        console.error(
          "Header count error:",
          error
        );

        setWishlistCount(0);
        setCartCount(0);
      } finally {
        setLoadingCounts(false);
      }
    }, [status]);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  // ============================================================
  // REFRESH WHEN WISHLIST / CART CHANGES
  // ============================================================

  useEffect(() => {
    function handleWishlistUpdated() {
      console.log(
        "Wishlist updated - refreshing header count"
      );

      loadCounts();
    }

    function handleCartUpdated() {
      console.log(
        "Cart updated - refreshing header count"
      );

      loadCounts();
    }

    window.addEventListener(
      "wishlist-updated",
      handleWishlistUpdated
    );

    window.addEventListener(
      "cart-updated",
      handleCartUpdated
    );

    return () => {
      window.removeEventListener(
        "wishlist-updated",
        handleWishlistUpdated
      );

      window.removeEventListener(
        "cart-updated",
        handleCartUpdated
      );
    };
  }, [loadCounts]);

  // ============================================================
  // REFRESH WHEN USER RETURNS TO PAGE
  // ============================================================

  useEffect(() => {
    function handleFocus() {
      loadCounts();
    }

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        "visible"
      ) {
        loadCounts();
      }
    }

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [loadCounts]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="border-b border-[#C4A892]/20 bg-[#E8DBCA]/40 py-2 text-[#22211B]">

      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 lg:px-8">

        {/* =====================================================
            LEFT SIDE
        ====================================================== */}

        <div className="flex items-center gap-3 text-[11px] sm:gap-4 sm:text-xs">

          {/* =================================================
              PHONE
          ================================================== */}

          <a
            href="tel:+91990014886"
            className="flex items-center gap-1.5 transition hover:text-[#4D3024]"
            aria-label="Call TCL Gallery"
            title="Call TCL Gallery"
          >
            <FiPhone
              size={13}
              strokeWidth={1.7}
            />

            <span>
              +91 990014886
            </span>
          </a>

          {/* DIVIDER */}

          <span className="hidden text-[#C4A892] sm:inline">
            |
          </span>

          {/* =================================================
              EMAIL
          ================================================== */}

          <a
            href="mailto:info@tclgallery.com"
            className="hidden items-center gap-1.5 transition hover:text-[#4D3024] sm:flex"
            aria-label="Email TCL Gallery"
            title="Email TCL Gallery"
          >
            <FiMail
              size={13}
              strokeWidth={1.7}
            />

            <span>
              info@tclgallery.com
            </span>
          </a>

        </div>

        {/* =====================================================
            RIGHT SIDE
        ====================================================== */}

        <div className="flex items-center gap-3 text-[11px] font-medium">

          {/* =================================================
              LOADING
          ================================================== */}

          {status === "loading" && (
            <span className="animate-pulse text-gray-400">
              Loading...
            </span>
          )}

          {/* =================================================
              LOGGED IN ACCOUNT
          ================================================== */}

          {status === "authenticated" &&
            session && (
              <div
                className="relative"
                ref={dropdownRef}
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenAccount(
                      (prev) => !prev
                    )
                  }
                  className="flex items-center gap-1 transition hover:text-[#4D3024]"
                  aria-label="My Account"
                  title="My Account"
                >

                  <FiUser size={15} />

                  <span className="hidden lg:inline">
                    My Account
                  </span>

                  <FiChevronDown
                    size={12}
                    className={`transition-transform duration-200 ${
                      openAccount
                        ? "rotate-180"
                        : ""
                    }`}
                  />

                </button>

                {/* =================================================
                    ACCOUNT DROPDOWN
                ================================================== */}

                {openAccount && (
                  <div className="absolute right-0 top-full z-[100] mt-3 w-56 overflow-hidden rounded-md border border-[#C4A892]/30 bg-white shadow-xl">

                    {/* USER */}

                    <div className="border-b border-[#C4A892]/20 bg-[#F7F3EE] px-4 py-3">

                      <p className="font-semibold text-[#22211B]">
                        {session.user?.name ||
                          "User"}
                      </p>

                      <p className="truncate text-[10px] text-gray-500">
                        {session.user?.email}
                      </p>

                    </div>

                    {/* PROFILE */}

                    <Link
                      href="/my-account"
                      onClick={() =>
                        setOpenAccount(false)
                      }
                      className="flex items-center gap-2 px-4 py-3 transition hover:bg-[#F7F3EE]"
                    >
                      <FiUser
                        size={14}
                      />

                      <span>
                        My Profile
                      </span>
                    </Link>

                    {/* ORDERS */}

                    <Link
                      href="/my-account/orders"
                      onClick={() =>
                        setOpenAccount(false)
                      }
                      className="flex items-center gap-2 px-4 py-3 transition hover:bg-[#F7F3EE]"
                    >
                      <FiPackage
                        size={14}
                      />

                      <span>
                        My Orders
                      </span>
                    </Link>

                    {/* TRACKING */}

                    <Link
                      href="/my-account/tracking"
                      onClick={() =>
                        setOpenAccount(false)
                      }
                      className="flex items-center gap-2 px-4 py-3 transition hover:bg-[#F7F3EE]"
                    >
                      <FiMapPin
                        size={14}
                      />

                      <span>
                        Track Order
                      </span>
                    </Link>

                    {/* ADMIN */}

                    {isAdmin && (
                      <>
                        <div className="border-t border-gray-100" />

                        <Link
                          href="/admin"
                          onClick={() =>
                            setOpenAccount(
                              false
                            )
                          }
                          className="flex items-center gap-2 px-4 py-3 font-semibold text-[#4D3024] transition hover:bg-[#F7F3EE]"
                        >
                          <FiShield
                            size={14}
                          />

                          <span>
                            Admin Dashboard
                          </span>
                        </Link>
                      </>
                    )}

                    {/* DIVIDER */}

                    <div className="border-t border-gray-100" />

                    {/* LOGOUT */}

                    <button
                      type="button"
                      onClick={() =>
                        signOut({
                          callbackUrl: "/",
                        })
                      }
                      className="flex w-full items-center gap-2 px-4 py-3 text-red-600 transition hover:bg-red-50"
                    >
                      <FiLogOut
                        size={14}
                      />

                      <span>
                        Logout
                      </span>
                    </button>

                  </div>
                )}

              </div>
            )}

          {/* =================================================
              LOGGED OUT ACCOUNT
          ================================================== */}

          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="flex items-center gap-1 font-semibold transition hover:text-[#4D3024]"
              aria-label="Login"
              title="Login"
            >
              <FiUser size={15} />

              <span className="hidden lg:inline">
                My Account
              </span>
            </Link>
          )}

          {/* DIVIDER */}

          <span className="text-gray-300">
            |
          </span>

          {/* =================================================
              WISHLIST
          ================================================== */}

          <Link
            href="/wishlist"
            className="relative flex h-8 w-8 items-center justify-center transition hover:text-[#4D3024]"
            aria-label="Wishlist"
            title="Wishlist"
          >

            <FiHeart size={19} />

            {status === "authenticated" &&
              wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4D3024] px-1 text-[8px] font-bold leading-none text-white">
                  {wishlistCount > 99
                    ? "99+"
                    : wishlistCount}
                </span>
              )}

          </Link>

          {/* =================================================
              CART
          ================================================== */}

          <Link
            href="/cart"
            className="relative flex h-8 w-8 items-center justify-center transition hover:text-[#4D3024]"
            aria-label="Shopping Cart"
            title="Shopping Cart"
          >

            <FiShoppingCart
              size={19}
            />

            {status === "authenticated" &&
              cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#4D3024] px-1 text-[8px] font-bold leading-none text-white">
                  {cartCount > 99
                    ? "99+"
                    : cartCount}
                </span>
              )}

          </Link>

          {/* =================================================
              CHECKOUT
          ================================================== */}

          <Link
            href="/checkout"
            className="hidden items-center gap-1 transition hover:text-[#4D3024] sm:flex"
            aria-label="Checkout"
            title="Checkout"
          >

            <FiCreditCard
              size={15}
            />

         

          </Link>

        </div>

      </div>

    </div>
  );
}